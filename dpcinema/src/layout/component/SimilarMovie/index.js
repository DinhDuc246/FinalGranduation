import { useEffect, useState } from 'react';
import styles from './Similar.module.scss';
import classNames from 'classnames/bind';

import requestApi from '~/apiService';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Img } from '~/apiService/instance';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';

const cs = classNames.bind(styles);

function SimilarMovie({ movieId }) {
    const [similar, setSimilar] = useState([]);
    const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     async function getCast() {
    //         if (slug) {
    //             const result = await requestApi.getSimilar(slug);
    //             setSimilar(result.data);

    //             console.log(result.data);
    //             setLoading(false);
    //         }
    //     }
    //     getCast();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [slug]);
    useEffect(() => {
        async function getRecommend() {
            if (movieId) {
                const result = await requestApi.getRecommend(movieId);
                setSimilar(result.data);

                console.log(result.data);
                setLoading(false);
            }
        }
        getRecommend();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [movieId]);
    return (
        <div className={cs('wrapper')}>
            <Swiper grabCursor spaceBetween={10} slidesPerView={'auto'}>
                {loading
                    ? Array(5)
                          .fill(7)
                          .map((v, i) => (
                              <SwiperSlide key={i} className={cs('swiperItem', 'swiperItem-ske')}>
                                  <Skeleton className={cs('movieImg')} />
                              </SwiperSlide>
                          ))
                    : similar.map((list, index) => (
                          <SwiperSlide key={index} className={cs('swiperItem')}>
                              <Link to={`/movie/watch/${list.slug}`}>
                                  <img className={cs('movieImg')} src={Img.baseImg(list.backdrop_path)} alt="" />
                                  <span>{list.name}</span>
                              </Link>
                          </SwiperSlide>
                      ))}
            </Swiper>
        </div>
    );
}

export default SimilarMovie;
