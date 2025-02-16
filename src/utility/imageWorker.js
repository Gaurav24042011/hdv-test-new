self.onmessage = async (event) => {
    const { url, id } = event.data;
  
    try {
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch the image. Status: ${response.status}`);
      }
  
      const blob = await response.blob();
      const fileName = url.split("/").pop() || `image-${id}.jpg`;
      const file = new File([blob], fileName, { type: blob.type });
  
      const reader = new FileReader();
      reader.onload = () => {
        self.postMessage({ id, file, src: reader.result });
      };
      reader.onerror = () => {
        self.postMessage({ error: "Failed to read the file as base64." });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      self.postMessage({ error: error.message });
    }
  };