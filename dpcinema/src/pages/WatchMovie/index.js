/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/iframe-has-title */
import styles from './WatchMovie.module.scss';
import classNames from 'classnames/bind';
import { useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

import requestApi from '~/apiService';
// import Season from './Season';
import Episode from './Episode';
import { Img } from '~/apiService/instance';
import SimilarMovie from '~/layout/component/SimilarMovie';
import { addHistoryMovie } from '~/apiService/user';
import { getMulti } from '~/apiService/genres';
import Comment from '~/layout/component/Comments';
import { updateView } from '~/apiService/movie';
import Skeleton from 'react-loading-skeleton';
import axios from 'axios';

const cs = classNames.bind(styles);

function WatchMovie() {
    const user = JSON.parse(localStorage.getItem('user'));
    const { category, slug } = useParams();
    const [searchParams] = useSearchParams();
    const [genres, setGenres] = useState([]);
    const [movieDetail, setMovieDetail] = useState([]);
    const [loading, setLoading] = useState(true);
    const [src, setSrc] = useState('');
    const [part, setPart] = useState(1);
    // let src = `https://www.2embed.to/embed/tmdb/${category}?id=${id}`;

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (category === 'movie') {
                    //id chính là url play phim truyền vào
                    //dùng link của ophim.com
                    const res = await axios.get(`${movieDetail?.id}`);
                    const linkvideo = res.data.episodes[0].server_data[0].link_embed;
                    setSrc(linkvideo);
                }
                if (category === 'tv') {
                    setPart(searchParams.get('episode') || 1);
                    const res = await axios.get(`${movieDetail?.id}`);
                    const linkvideo = res.data.episodes[0].server_data[part - 1].link_embed;
                    setSrc(linkvideo);
                }
            } catch (error) {
                console.error(error);
            }
        };

        if (movieDetail) {
            fetchData();
        }
    }, [searchParams, category, movieDetail, part, slug]);

    useEffect(() => {
        async function getDeTailMovie() {
            if (slug) {
                const result = await requestApi.getDetails(slug);
                const dataGenres = await getMulti(result.data.slug);
                setGenres(dataGenres.data);
                setMovieDetail(result.data);
                setLoading(false);
                console.log('result.data', result.data);
            }
        }
        getDeTailMovie();
    }, [slug]);

    useEffect(() => {
        const handleAddView = async () => {
            try {
                if (slug) updateView(slug);
            } catch (error) {
                console.log(error);
            }
        };

        const index = setTimeout(() => {
            handleAddView();
        }, 10000);

        return () => clearTimeout(index);
    }, [slug]);

    useEffect(() => {
        if (user && movieDetail) {
            const handleAddHistory = async () => {
                try {
                    await addHistoryMovie(movieDetail._id, user.id);
                } catch (error) {
                    console.log(error);
                }
            };

            const index = setTimeout(() => {
                handleAddHistory();
            }, 10000);

            return () => clearTimeout(index);
        }
    }, [movieDetail, slug]);

    return (
        <div className={cs('wrapper')}>
            <iframe
                className={cs('videofilm')}
                src={src}
                width="100%"
                height="550px"
                allowFullScreen
                // frameBorder="0"
            ></iframe>
            {movieDetail && (
                <>
                    <div className={cs('InforDetail')}>
                        {loading ? (
                            <Skeleton className={cs('poster')} style={{ width: '200px' }} />
                        ) : (
                            <img
                                src={Img.posterImg(movieDetail.poster_path || movieDetail.backdrop_path)}
                                className={cs('poster')}
                                alt=""
                            ></img>
                        )}
                        {loading ? (
                            <div className={cs('content')}>
                                <Skeleton className={cs('title')} />
                                <div className={cs('genres')}>
                                    <Skeleton className={cs('genres-item')} style={{ width: '100px' }} />
                                </div>

                                <div className={cs('rate')}>
                                    <FontAwesomeIcon className={cs('icon')} icon={faStar} />
                                    {movieDetail.ibmPoints}
                                </div>
                                <div className={cs('summary')}>
                                    <h4>Tóm tắt</h4>
                                    <Skeleton className={cs('overview')} style={{ width: '900px', height: '70px' }} />
                                </div>
                            </div>
                        ) : (
                            <div className={cs('content')}>
                                <h2 className={cs('title')}>{movieDetail.name} </h2>
                                <div className={cs('genres')}>
                                    {genres.map((genre, index) => {
                                        return (
                                            <span className={cs('genres-item')} key={index}>
                                                {genre.name}
                                            </span>
                                        );
                                    })}
                                </div>
                                <div className={cs('country')}>
                                    <h2 className={cs('country-item')}>{movieDetail.country} </h2>
                                </div>
                                <div className={cs('rate')}>
                                    <FontAwesomeIcon className={cs('icon')} icon={faStar} />
                                    {movieDetail.ibmPoints}
                                </div>

                                <div className={cs('summary')}>
                                    <h4>Tóm tắt</h4>
                                    <p className={cs('overview')}>{movieDetail.overview}</p>
                                </div>
                            </div>
                        )}
                    </div>
                    {category === 'tv' && (
                        <>
                            {/* <h4 className={cs('titleTv')}>Season</h4>
                            <div className={cs('allSeaon')}>
                                {movieDetail.seasons
                                    .filter((season) => season.season_number !== 0 && season.episode_count > 0)
                                    .map((season, index) => (
                                        <Season key={index} season={season} />
                                    ))}
                            </div> */}
                            <h4 className={cs('titleTv')}>Tập</h4>
                            <Episode movieDetail={movieDetail} />
                        </>
                    )}

                    <div className={cs('Similar')}>
                        <h4 className={cs('titleOverview')}>Đề xuất</h4>
                        <SimilarMovie movieId={movieDetail._id} />
                    </div>

                    <div>
                        <Comment MovieId={movieDetail._id} />
                    </div>
                </>
            )}
        </div>
    );
}

export default WatchMovie;
