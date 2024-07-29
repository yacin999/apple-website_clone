import React, { useEffect, useRef, useState } from 'react'
import { hightlightsSlides } from '../constants'
import gsap from 'gsap'
import { pauseImg, playImg, replayImg } from '../utils'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);



const VideoCarousel = () => {
    const videoRef = useRef([])
    const videoSpanRef = useRef([])
    const videoDivRef = useRef([])


    const [video, setVideo] = useState({
        isEnd : false,
        startPlay : false,
        videoId : 0,
        isLastVideo : false,
        isPlaying : false
    })
    const [loadedData, setLoadedData] = useState([])
 
    const {isEnd, isLastVideo, startPlay, videoId, isPlaying} = video

    
    
    useGSAP(() => {
        gsap.to("#video", {
            scrollTrigger: {
              trigger: "#video",
              toggleActions: "restart none none none",
            },
            onComplete: () => {
              setVideo((pre) => ({
                ...pre,
                startPlay: true,
                isPlaying: true,
              }));
            },
          });
    }, [isEnd, videoId])


    const handleLoadedMetaData = (i, e) => setLoadedData((pre) => [...pre, e])
    
    useEffect(()=> {
        let currentProgress = 0
        let span = videoSpanRef.current

        if (span[videoId]) {
            // animate the progress of the video
            let anim = gsap.to(span[videoId], {
                onUpdate : () => {
                    const progress = Math.ceil(anim.progress() * 100)
                    if (progress != currentProgress) {
                        currentProgress = progress

                        gsap.to(videoDivRef.current[videoId], {
                            width:
                            window.innerWidth < 760
                              ? "10vw" // mobile
                              : window.innerWidth < 1200
                              ? "10vw" // tablet
                              : "4vw", // laptop
                        })

                        gsap.to(span[videoId], {
                            width : `${currentProgress}%`,
                            backgroundColor : "white"
                        })
                    }
                },
                onComplete : () => {
                    if (isPlaying) {
                        gsap.to(videoDivRef.current[videoId], {
                            width : "12px",
                        })
                        gsap.to(span[videoId], {
                            backgroundColor : "#AFAFAF"
                        })
                    }
                }
            })

            if (videoId === 0) {
                anim.restart()
            }

            console.log("test video ref progress :", videoRef.current[videoId].currentTime)

            const animUpdate = () => {
                anim.progress(videoRef.current[videoId].currentTime / hightlightsSlides[videoId].videoDuration)
            }
    
            if (isPlaying) {
                gsap.ticker.add(animUpdate)
            }else {
                gsap.ticker.remove(animUpdate)
            }
        }
    }, [videoId, startPlay])

    useEffect(() => {
      
        if (loadedData.length > 3) {
            if (!isPlaying) {
                videoRef.current[videoId].pause()
            }else {
                startPlay && videoRef.current[videoId].play();
            }
        }
      
    }, [startPlay, videoId, isPlaying, loadedData])
    


    const handleProcess = (type, i) => {
        switch (type) {
            case "video-end":
                setVideo(prev => ({...prev, isEnd : true, videoId : i + 1}))
                break;
            case "video-last":
                setVideo(prev => ({...prev, isLastVideo : true}))
                break;
            case "video-reset":
                setVideo(prev => ({...prev, isLastVideo : false, videoId : 0}))
                break;
            case "play":
                setVideo(prev => ({...prev, isPlaying : !prev.isPlaying}))
                break;
            default:
                return video;
        }
    }

  return (
    <>
        <div className='flex items-center'>
            {hightlightsSlides.map((slide, index) => (
                <div 
                    key={slide.id}
                    id='slider'
                    className='sm:pr-20 pr-10'
                >
                    <div className='video-carousel_container'>
                        <div className='w-full h-full flex-center rounded-3xl overflow-hidden bg-black'>
                            <video
                                id='video'
                                playsInline={true}
                                preload='auto'
                                muted
                                ref={(el)=> (videoRef.current[index] = el)}
                                onPlay={() => {
                                    setVideo((prevVideo)=>({
                                        ...prevVideo,
                                        isPlaying : true
                                    }))
                                }}
                                onEnded={() => {
                                    index !== 3 
                                    ? handleProcess("video-end", i)
                                    : handleProcess("video-last")
                                }}
                                onLoadedMetadata={(e) => handleLoadedMetaData(index, e)}
                            >
                                <source src={slide.video} type='video/mp4'/> 
                            </video>
                        </div>

                        <div className='absolute top-12 left-[5%] z-10'>
                            {slide.textLists.map(text => (
                                <p key={text} className='md:text-2xl text-xl font-medium'>{text}</p>
                            ))}
                        </div>
                    </div>    
                </div>
            ))}
        </div>

        <div className='relative flex-center mt-10'>
            <div className='flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full'>
                {videoRef.current.map((_, i) => (
                    <span 
                        key={i} 
                        ref={(el)=> (videoDivRef.current[i] = el)}
                        className='mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer'
                    >
                        <span 
                            className='absolute h-full w-full rounded-full'
                            ref={(el)=> (videoSpanRef.current[i] = el)}
                        >
                        </span>
                    </span>
                ))}
            </div>

            <button className='control-btn'>
                <img 
                    src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg }
                    alt={isLastVideo ? 'replay' : !isPlaying ? "play" : "pause"}
                    onClick={isLastVideo ? () => {
                        handleProcess("video-reset")
                    } : !isPlaying ? () => {
                        handleProcess("play")
                    } : () => {
                        handleProcess("pause")
                    }}
                />
            </button>
        </div>
    </>
  )
}

export default VideoCarousel