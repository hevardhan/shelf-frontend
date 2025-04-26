from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import base64
import cv2
import numpy as np
from io import BytesIO
from PIL import Image, ImageOps, ImageFilter

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def process_image(image_bytes):
    """Process the uploaded image and count objects using cv2."""
    # Read image from bytes using OpenCV
    np_image = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(np_image, cv2.IMREAD_COLOR)

    # Preprocess the image (grayscale and threshold)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, binary_image = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)

    # Count objects (e.g., using contours)
    contours, _ = cv2.findContours(binary_image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    object_count = len(contours)

    # Drawing bounding boxes on the image
    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)

    # Convert image to base64 for frontend display
    _, buffer = cv2.imencode('.png', image)
    img_str = base64.b64encode(buffer).decode('utf-8')

    return object_count, img_str


@app.post("/process-image/")
async def preprocess_image(request: Request):
    data = await request.json()
    base64_image = data.get("image_base64")
    processing_type = data.get("type")
    threshold_value = data.get("threshold", 128)  # Default threshold value

    try:
        # Strip header (data:image/png;base64,...)
        header, encoded = base64_image.split(",", 1)
        image_data = base64.b64decode(encoded)

        # Use OpenCV to process the image
        np_image = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(np_image, cv2.IMREAD_COLOR)

        if processing_type == "grayscale":
            image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        elif processing_type == "edges":
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            image = cv2.Canny(gray, 100, 200)

        elif processing_type == "threshold":
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            _, image = cv2.threshold(gray, threshold_value, 255, cv2.THRESH_BINARY)

        # Convert image to base64 for frontend display
        _, buffer = cv2.imencode('.png', image)
        img_str = base64.b64encode(buffer).decode('utf-8')

        return JSONResponse(content={"processed_image": f"data:image/png;base64,{img_str}"})

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


def preprocess_image_from_bytes(image_bytes):
    """Convert image bytes to OpenCV image and preprocess."""
    np_image = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(np_image, cv2.IMREAD_COLOR)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Apply Adaptive Thresholding
    binary_image = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                         cv2.THRESH_BINARY_INV, 15, 2)

    # Morphological Closing
    kernel = np.ones((5, 5), np.uint8)
    binary_image = cv2.morphologyEx(binary_image, cv2.MORPH_CLOSE, kernel)

    return image, binary_image

def contour_analysis(binary_image):
    """Analyze contours to count objects."""
    contours, _ = cv2.findContours(binary_image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    return len(contours), contours

def connected_components(binary_image):
    """Connected Component Analysis."""
    num_labels, _, _, _ = cv2.connectedComponentsWithStats(binary_image, connectivity=8)
    return num_labels - 1  # Exclude background

def detect_circular_objects(image):
    """Detect circular objects like bottles/cans."""
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (7, 7), 1.5)
    circles = cv2.HoughCircles(blurred, cv2.HOUGH_GRADIENT, dp=1.2, minDist=30,
                               param1=50, param2=30, minRadius=10, maxRadius=100)
    return len(circles[0, :]) if circles is not None else 0

def apply_watershed(image, binary_image):
    """Apply Watershed Algorithm to separate overlapping objects."""
    dist_transform = cv2.distanceTransform(binary_image, cv2.DIST_L2, 5)
    _, sure_fg = cv2.threshold(dist_transform, 0.5 * dist_transform.max(), 255, 0)
    sure_fg = np.uint8(sure_fg)
    unknown = cv2.subtract(binary_image, sure_fg)
    _, markers = cv2.connectedComponents(sure_fg)
    markers = markers + 1
    markers[unknown == 255] = 0
    cv2.watershed(image, markers)
    return np.max(markers) - 1  # Number of separated objects

def process_image(image_bytes):
    """Process the uploaded image and count objects dynamically."""
    # Preprocess the image
    image, binary_image = preprocess_image_from_bytes(image_bytes)

    # Step 1: Contour Analysis & Connected Components
    contour_count, contours = contour_analysis(binary_image)
    cca_count = connected_components(binary_image)

    # Step 2: Detect circular objects
    circle_count = detect_circular_objects(image)

    # Step 3: Use Watershed if discrepancies exist
    if abs(contour_count - cca_count) > 3:
        watershed_count = apply_watershed(image, binary_image)
    else:
        watershed_count = None

    # Dynamic selection of method
    if circle_count > 0:
        final_count = circle_count
        method_used = "Hough Circles"
    elif abs(contour_count - cca_count) < 3:
        final_count = max(contour_count, cca_count)
        method_used = "Contour Analysis / CCA"
    else:
        final_count = watershed_count
        method_used = "Watershed Algorithm"

    # Draw contours or bounding boxes on the image
    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)

    # Encode the processed image as base64
    _, buffer = cv2.imencode('.png', image)
    img_str = base64.b64encode(buffer).decode('utf-8')

    return {
        "object_count": final_count,
        "method_used": method_used,
        "processed_image": f"data:image/png;base64,{img_str}"
    }


@app.post("/count-objects/")
async def count_objects(request: Request):
    data = await request.json()
    base64_image = data.get("image_base64")

    try:
        # Decode Base64 image
        header, encoded = base64_image.split(",", 1)
        image_data = base64.b64decode(encoded)

        # Process the image and count objects
        result = process_image(image_data)

        # Return the result as JSON
        return JSONResponse(result)

    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)