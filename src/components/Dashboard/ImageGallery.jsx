import { Button, Image, Input, Spin } from "antd";
import { useEffect, useState } from "react";
import { getImagesList, uploadImage } from "../../utils/firebase";
import { Loading3QuartersOutlined } from "@ant-design/icons";

const ImageGallery = () => {
  const [imageUpload, setImageUpload] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (!imageUpload) return;
    setIsLoading(true);

    await uploadImage(imageUpload);
    const images = await getImagesList();
    setImageList(images);

    setImageUpload(null);
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true);
      const images = await getImagesList();
      setImageList(images);
      setIsLoading(false);
    };

    fetchImages();
  }, []);

  return (
    <section className="image-gallery-section">
      <div className="upload-container">
        <Input
          type="file"
          onChange={(e) => setImageUpload(e.target.files[0])}
        />
        <Button type="primary" onClick={handleClick} disabled={!imageUpload}>
          Upload Image
        </Button>
      </div>

      <div className="gallery-container">
        {isLoading ? (
          <div className="loading">
            <Spin
              indicator={<Loading3QuartersOutlined spin />}
              tip="Loading..."
            />
          </div>
        ) : imageList.length === 0 ? (
          <div className="no-img">
            <p>No images yet. Upload your first image to get started!</p>
          </div>
        ) : (
          imageList.map((img) => (
            <div key={img.name} className="image-card">
              <Image src={img.url} alt={img.name} />
              <p className="img-name">{img.name}</p>
              <p className="img-details">
                Size: {(img.size / 1024).toFixed(2)} KB
              </p>
              <p className="img-details">
                Type: {img.contentType || "Unknown"}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default ImageGallery;
