import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { ImageGallery } from '../ImageGallery/ImageGallery';
import Searchbar from '../Searchbar/Searchbar';
import { fetchImages } from 'components/api-service/api';
import { Loader } from '../Loader/Loader';
import { Modal } from '../Modal/Modal';
import { AppWrapper } from './App.styled';
import { Button } from 'components/Button/Button';

const App = () => {
  const [searchValue, setSearchValue] = useState('');
  const [largeImgUrl, setLargeImgUrl] = useState('');
  const [images, setImages] = useState([]);
  const [isloading, setIsloading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [showLoadMoreBtn, setShowLoadMoreBtn] = useState(false);

  const handleFormSubmit = searchValue => {
    setSearchValue(searchValue);
    setPage(1);
    setImages([]);
  };

  const handleLargeImgUrl = url => {
    setLargeImgUrl(url);
  };

  const onModalClose = () => {
    setLargeImgUrl('');
  };

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  useEffect(() => {
    if (searchValue === '') {
      return;
    }
    async function fetchImage() {
      try {
        setIsloading(true);
        setError(null);
        const data = await fetchImages(searchValue, page);
        if (!data.totalHits) {
          return toast.error(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        } else {
          setImages(prevImages => [...prevImages, ...data.hits]);
          setShowLoadMoreBtn(page < Math.ceil(data.totalHits / 12));

          if (page === 1) {
            toast.success(`Hooray! We found ${[data.totalHits]} images.`);
          }
        }
      } catch (error) {
        setError('Error');
      } finally {
        setIsloading(false);
      }
    }
    fetchImage();
  }, [searchValue, page]);

  return (
    <AppWrapper>
      <Searchbar onSubmit={handleFormSubmit} />
      {images.length > 0 && (
        <ImageGallery images={images} setLargeImgUrl={handleLargeImgUrl} />
      )}
      {isloading && <Loader />}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {largeImgUrl && <Modal img={largeImgUrl} onClose={onModalClose} />}
      {showLoadMoreBtn && <Button onClick={loadMore} />}
      <ToastContainer autoClose={2000} pauseOnHover />
    </AppWrapper>
  );
};

export default App;
