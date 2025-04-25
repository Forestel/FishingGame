import React, { useState } from 'react';
import './Fish.css';
import sunbeamFishImg from '../../images/carp.png';
import navalCommanderFishImg from '../../images/carp1.png';
import deepResearcherFishImg from '../../images/carp2.png';
import carp3Img from '../../images/carp3.png';
import carp4Img from '../../images/carp4.png';


const Fish = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const fishData = [
    {
      id: 'sunbeam',
      title: 'Сонячний Промінь',
      image: sunbeamFishImg,
      description: 'Яскрава рибка, що любить грітися в сонячних променях. Її золотаста луска переливається, немов справжнє сонце під водою.'
    },
    {
      id: 'naval',
      title: 'Морський Командир',
      image: navalCommanderFishImg,
      description: 'Велика та впевнена рибка з синіми відтінками. Завжди на чолі зграї, провідник та захисник морських глибин.'
    },
    {
      id: 'deep',
      title: 'Глибинний Дослідник',
      image: deepResearcherFishImg,
      description: 'Унікальна рибка з надзвичайною здатністю досліджувати найтемніші куточки океану. Її очі адаптовані до повної темряви.'
    },
    {
        id: 'moor',
        title: 'Морський Мандрівник',
        image: carp3Img,
        description: 'Елегантна риба з ніжно-блакитними відтінками та витонченими лініями. Мешкає у коралових рифах Тихого океану. Відрізняється надзвичайною маневреністю та здатністю швидко пересуватися між коралами.'
      },
      {
        id: 'briz',
        title: 'Сонячний Бриз',
        image: carp4Img,
        description: 'Життєрадісна жовта риба з яскравими плямами та доброзичливим виразом. Мешкає в теплих тропічних водах Карибського моря. Відома своєю грайливою природою та цікавістю до навколишнього світу.'
      },
  ];

  return (
    <section className="Fish">
      
      <div className="container">
      <div className="fish__border">
        <div className="fishcontainer">
          <div className="fishtext">
            <p className="fishtextcenter">Рибки</p>
          </div>
         
          <div className="fish__content">
            {fishData.map((fish) => (
              <div 
                key={fish.id}
                className={`fish-card ${hoveredCard === fish.id ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredCard(fish.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {hoveredCard !== fish.id ? (
                  <>
                    <img src={fish.image} alt="" className='fishImg' />
                    <p>{fish.title}</p>
                  </>
                ) : (
                  <div className="fish-card-hover">
                    <h3>{fish.title}</h3>
                    <p>{fish.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Fish;