import React, { useEffect, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import './FishingGame.css';

// Import images directly
import backgroundMenuImg from '../../images/bg2.png';
import backgroundGameImg from '../../images/fon.png';
import rodImg from '../../images/rod.png';
import bobberImg from '../../images/3170712.png';
import carp1Img from '../../images/carp1.png';
import carp2Img from '../../images/carp2.png';
import carp3Img from '../../images/carp3.png';
import carp4Img from '../../images/carp4.png';
import carpImg from '../../images/carp.png';
import popupBgImg from '../../images/Poup.png';

const FishingGame = () => {
  const navigate = useNavigate();
  
  // Game state
  const [gameState, setGameState] = useState('menu');
  const [totalWeight, setTotalWeight] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [isFishing, setIsFishing] = useState(false);
  const [bobberPosition, setBobberPosition] = useState({ x: 0, y: 0 });
  const [bobberOffset, setBobberOffset] = useState(0);
  const [progressValue, setProgressValue] = useState(100);
  const [fishingActive, setFishingActive] = useState(false);
  const [currentKey, setCurrentKey] = useState('A');
  const [keysToPress] = useState(['A', 'S', 'D']);
  const successCountRef = useRef(0);

  const [statusMessage, setStatusMessage] = useState("Клацніть на озері, щоб закинути вудку!");
  const [showCaughtFish, setShowCaughtFish] = useState(false);
  const [fishDetails, setFishDetails] = useState({ weight: 0, points: 0, image: null });
  const [imagesLoaded, setImagesLoaded] = useState(false);
  

  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const progressTimerRef = useRef(null);
  const fishingDelayRef = useRef(null);
  
  // Game settings
  const requiredKeyPresses = 3;
  const progressBarMax = 100;
  
  // Helper for random numbers
  const getRandomInt = (max) => Math.floor(Math.random() * max);

  // Images object
  const [images, setImages] = useState({});

  // Function to go back to the main page
  const goToHomePage = () => {
    navigate('/');
  };

  // Load images
  useEffect(() => {
    const loadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    };

    Promise.all([
      loadImage(backgroundMenuImg),
      loadImage(backgroundGameImg),
      loadImage(rodImg),
      loadImage(bobberImg),
      loadImage(carp1Img),
      loadImage(carp2Img),
      loadImage(carp3Img),
      loadImage(carp4Img),
      loadImage(carpImg)
    ]).then(loadedImages => {
      setImages({
        backgroundMenu: loadedImages[0],
        backgroundGame: loadedImages[1],
        rod: loadedImages[2],
        bobber: loadedImages[3],
        carp1: loadedImages[4],
        carp2: loadedImages[5],
        carp3: loadedImages[6],
        carp4: loadedImages[7],
        carp: loadedImages[8]
      });
      setImagesLoaded(true);
    }).catch(error => {
      console.error("Failed to load images:", error);
    });
  }, []);

  // Handle key presses
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameState !== 'game' || !isFishing || !fishingActive) {
        return;
      }
      
      const pressedKey = e.key.toUpperCase();
      
     if (pressedKey === currentKey) {
  successCountRef.current += 1;
  if (successCountRef.current >= requiredKeyPresses) {
    catchFish();
    successCountRef.current = 0;
  } else {
    setProgressValue(prev => Math.min(prev + 20, progressBarMax));
    setCurrentKey(keysToPress[getRandomInt(keysToPress.length)]);
  }
} else {
        // Wrong key pressed
        setProgressValue(prev => {
          const newValue = prev - 30;
          if (newValue <= 0) {
            fishGotAway();
            return 0;
          }
          return newValue;
        });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameState, isFishing, fishingActive, currentKey, keysToPress]);

  // Start fishing when canvas is clicked
  const handleCanvasClick = (e) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (gameState === 'menu') {
      // Check for button clicks in menu
      if (y >= canvas.height / 2 - 30 && y <= canvas.height / 2 + 30) {
        if (x >= canvas.width / 2 - 100 && x <= canvas.width / 2 + 100) {
          // Start game button clicked
          setGameState('game');
        }
      } else if (y >= canvas.height / 2 + 70 && y <= canvas.height / 2 + 130) {
        if (x >= canvas.width / 2 - 100 && x <= canvas.width / 2 + 100) {
          // Exit button clicked
          window.location.reload();
        }
      }
    } else if (gameState === 'game' && !isFishing) {
      // Start fishing if clicked in the lake area
      if (y >= 300) {
        startFishing(x, y);
      }
    }
  };

  // Start fishing process
  const startFishing = (x, y) => {
    setBobberPosition({ x, y });
    setIsFishing(true);
    setStatusMessage("Вудка закинута. Чекаємо на рибу...");
    
    // Simulate waiting for fish to bite
    fishingDelayRef.current = setTimeout(() => {
      setFishingActive(true);
      setProgressValue(progressBarMax);
      setCurrentKey(keysToPress[getRandomInt(keysToPress.length)]);
      setStatusMessage("Клює! Натискайте вказані клавіші!");
      
      // Start bobber animation
      let animationStep = 0;
      animationRef.current = setInterval(() => {
        animationStep += 0.1;
        setBobberOffset(Math.sin(animationStep) * 5);
      }, 50);
      
      // Start progress bar decrease
      progressTimerRef.current = setInterval(() => {
        setProgressValue(prev => {
          const newValue = prev - 1;
          if (newValue <= 0) {
            fishGotAway();
            return 0;
          }
          return newValue;
        });
      }, 50);
    }, (getRandomInt(5) + 2) * 1000);
  };

  // Successfully catch a fish
  const catchFish = () => {
    // Clean up animations and timers
    clearAllTimers();
    
    // Reset fishing state
    setIsFishing(false);
    setFishingActive(false);
    
    // Calculate fish weight and points
    const weight = getRandomInt(5) + 1;
    const points = weight * 15;
    
    setTotalWeight(prev => prev + weight);
    setTotalPoints(prev => prev + points);
    
    // Determine fish image based on weight
    let fishImage;
    if (weight <= 2) {
      fishImage = carp2Img;
    } else if (weight <= 3) {
      fishImage = carp1Img;
    } else if (weight <= 4) {
      fishImage = carp3Img;
    } else {
      fishImage = carp4Img;
    }
    
    // Show caught fish popup
    setFishDetails({
      weight,
      points,
      image: fishImage
    });
    
    setShowCaughtFish(true);
    setStatusMessage(`Загальна вага: ${totalWeight + weight} кг`);
  };

  // Fish got away
  const fishGotAway = () => {
    // Clean up animations and timers
    clearAllTimers();
    
    // Reset fishing state
    setIsFishing(false);
    setFishingActive(false);
    setStatusMessage("Упс! Риба зірвалася. Спробуйте ще раз!");
  };

  // Clear all timers and animations
  const clearAllTimers = () => {
    if (animationRef.current) clearInterval(animationRef.current);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    if (fishingDelayRef.current) clearTimeout(fishingDelayRef.current);
  };

  // Handle close of caught fish modal
  const handleCloseModal = () => {
    setShowCaughtFish(false);
  };

  // Draw game on canvas
  useEffect(() => {
    if (!imagesLoaded || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (gameState === 'menu') {
      // Draw menu
      ctx.drawImage(images.backgroundMenu, 0, 0, canvas.width, canvas.height);
      
      // Title
      ctx.fillStyle = 'white';
      ctx.font = 'bold 64px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Fishing Simulator', canvas.width / 2, canvas.height / 3);
      
      // Start button
      ctx.fillStyle = '#4CAF50';
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(canvas.width / 2 - 100, canvas.height / 2 - 30, 200, 60, 10) : 
                      ctx.rect(canvas.width / 2 - 100, canvas.height / 2 - 30, 200, 60);
      ctx.fill();
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 30px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Start', canvas.width / 2, canvas.height / 2 + 10);
      
     
      
      ctx.fillStyle = 'white';
      ctx.fillText('', canvas.width / 2, canvas.height / 2 + 110);
    } else if (gameState === 'game') {
      // Draw game background
      ctx.drawImage(images.backgroundGame, 0, 0, canvas.width, canvas.height);
      
      // Draw fishing rod
      ctx.drawImage(images.rod, 90, 123, 544, 344);
      
      // Draw status text
      ctx.fillStyle = 'blue';
      ctx.font = '24px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(statusMessage, 10, 30);
      
      // Draw score
      ctx.fillStyle = 'blue';
      ctx.font = '18px Arial';
      ctx.fillText(`Очки: ${totalPoints}`, 10, 70);
      
      // Draw fishing line if fishing
      if (isFishing) {
        const rodTip = { x: 613, y: 180 }; // Rod tip position
        
        ctx.beginPath();
        ctx.moveTo(rodTip.x, rodTip.y);
        ctx.lineTo(bobberPosition.x, bobberPosition.y);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw bobber
        if (images.bobber) {
          ctx.drawImage(
            images.bobber,
            bobberPosition.x - 15,
            bobberPosition.y + bobberOffset - 20,
            30,
            60
          );
        }
      }
    }
    
    // Set up animation loop
    const animFrame = requestAnimationFrame(() => {
      if (canvasRef.current) {
        const nextFrame = () => {
          // This will trigger the useEffect again
          setBobberOffset(prev => prev);
        };
        
        setTimeout(nextFrame, 16); // ~60fps
      }
    });
    
    return () => {
      cancelAnimationFrame(animFrame);
    };
  }, [gameState, isFishing, fishingActive, statusMessage, totalPoints, 
      bobberPosition, bobberOffset, progressValue, currentKey, imagesLoaded, images, totalWeight]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, []);

  // Save score before page unload
  useEffect(() => {
    const saveScore = () => {
      localStorage.setItem('fishingGameScore', totalPoints);
      console.log('Очки успішно збережено: ' + totalPoints);
    };
    
    window.addEventListener('beforeunload', saveScore);
    
    return () => {
      window.removeEventListener('beforeunload', saveScore);
    };
  }, [totalPoints]);

  // Loading screen
  if (!imagesLoaded) {
    return <div className="loading">Loading game assets...</div>;
  }

  return (
    <div className="fishing-game">
      {/* Home button */}
        <button 
          className="home-button"
          style={{
            position: 'absolute',
            top: '10px',
            right: '250px',
            padding: '20px 30px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            zIndex: 1000 // Ensure button is above canvas
          }}
          onClick={goToHomePage}
        >
          На головну
        </button>
      
      <canvas 
        ref={canvasRef} 
        width={1440} 
        height={768} 
        onClick={handleCanvasClick}
      />
      
      {/* JSX version of key indicators - these show on top of the canvas */}
      {isFishing && fishingActive && (
        <>
          <div className="progress-container" 
               style={{
                 position: 'absolute',
                 top: '84px',
                 left: '50%',
                 transform: 'translateX(-50%)',
                 width: '300px',
                 height: '40px',
                 backgroundColor: 'blue',
                 borderRadius: '20px'
               }}>
            <div className="progress-bar"
                 style={{
                   width: `${progressValue}%`,
                   height: '100%',
                   backgroundColor: 'lightgreen',
                   borderRadius: '20px'
                 }}>
            </div>
          </div>
          
          <div className="key-hint"
               style={{
                 position: 'absolute',
                 top: '76%',
                 right: '330px',
                 width: '50px',
                 height: '50px',
                 backgroundColor: 'rgba(220, 0, 0, 0.8)',
                 borderRadius: '70%',
                 display: 'flex',
                 justifyContent: 'center',
                 alignItems: 'center',
                 color: 'white',
                 fontSize: '30px',
                 fontWeight: 'bold'
               }}>
            {currentKey}
          </div>
        </>
      )}
      
      {/* Fish caught modal */}
      {showCaughtFish && (
        <div className="fish-modal" 
             style={{ 
               position: 'absolute',
               top: '50%',
               left: '50%',
               transform: 'translate(-50%, -50%)',
               padding: '20px',
               backgroundColor: 'white',
               borderRadius: '40px',
               textAlign: 'center',
               backgroundImage: `url(${popupBgImg})`,
               minWidth: '300px',
               minHeight: '200px',
               display: 'flex',
               flexDirection: 'column',
               alignItems: 'center',
               justifyContent: 'center'
             }}>
          <h2>Ви зловили рибу вагою {fishDetails.weight} кг!</h2>
          <h2>Ви отримали {fishDetails.points} очок!</h2>
          <img src={fishDetails.image} alt="Fish" width={150} height={100} />
          <button 
            className="ok-button"
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
            onClick={handleCloseModal}>
            OK
          </button>
        </div>
      )}
    </div>
  );
};

export default FishingGame;