import React, { useState } from "react";

function NewImage() {
  const [images, setImages] = useState([]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };
  const processFiles = (files) => {
    const newImages = [...images];

    files.forEach((file) => {
      if (newImages?.length < 2) {
        const reader = new FileReader();
        reader.onload = () => {
          newImages.push({ id: newImages?.length, src: reader.result });
          setImages([...newImages]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleRemoveImage = (id) => {
    const filteredImages = images.filter((image) => image.id !== id);
    setImages(filteredImages);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    if (currentStep === 5) {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          if (key === "uploadPhoto")
            value.forEach((item) => data.append(key, item?.src));
          if (key === "timings")
            value.forEach((item) => data.append(key, JSON.stringify(item)));
          else value.forEach((item) => data.append(key, item));
        } else {
          data.append(key, value);
        }
      });

      try {
        const resp = await postApiData({
          url: API_ROUTE.ADD_BUSINESS,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: data,
        });
        if (resp.status === API_SUCCESS_CODE) {
          console.log("succes", resp);
          alert("business added successfully");
          resetAllState();
          return <Navigate to="/" replace />;
        } else {
          setApirError(resp?.message || "");
        }
      } catch (error) {
        setApirError(API_NETWORK_ERROR);
        logError("Error calling API:", error);
      }
    }
  };


  return (
    <div>
      <>
        <h2 className="step-title hdv-margin-bottom-16">Upload Your Photos</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            logInfo("Form submission prevented");
          }}
        >
          <div className="step-5-container ">
            <div
              className={`hdv-row  ${images?.length > 0 ? "hdv-margin-bottom-16" : ""}`}
            >
              <div className="form-group hdv-col-12 ">
                <div
                  className="upload-image-section"
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: "none" }}
                    id="file-upload"
                    onChange={handleImageUpload}
                    disabled={images?.length >= 2}
                  />
                  <label
                    htmlFor="file-upload"
                    className={`image-upload-label ${images?.length >= 2 ? "image-upload-label-disabled" : ""}`}
                  >
                    <img
                      src={camera}
                      alt="Upload Icon"
                      className="hdv-margin-bottom-4"
                    />
                    <span>Upload Photos or click here</span>
                  </label>
                  {images?.length >= 2 && (
                    <p style={{ color: "red" }}>
                      You can only upload up to 2 images.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {images?.length > 0 && (
              <div className="hdv-row img-preview-container">
                {images.map((image) => (
                  <div key={image.id} className="preview-image ">
                    <img src={image.src} alt={`Preview ${image.id}`} />
                    <button
                      onClick={() => handleRemoveImage(image.id)}
                      className="clear-img-preview"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>
      </>
    </div>
  );
}

export default NewImage;
