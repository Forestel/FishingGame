import React from 'react';
import Step1 from '../../images/Instruction/Step1.gif';
import Step2 from '../../images/Instruction/Step2.gif';
import './Instruction.css';
const Instruction = () => {
    return (<section className="Instruction">

        <div className="container">

            <div className="Instruction__Step">
            <div className="fish__border">
                <p className='h1_Instruction'>Інструкція</p>
                
                <div className="Instruction__Step1">

                    <div className="img__Instruction__Step1">
                        <img src={Step1} alt="" srcset="" />

                    </div>
                    <div className="Instruction__Step1__text">
                            <p className='Instruction__Step1__h1'>Крок 1: Закидання вудочки</p>
                            <p className='Instruction__Step1__p'>Щоб почати грати, запустіть гру та зачекайте, поки завантажиться головний екран. На ньому з’явиться рибалка в човні, водойма з рибами та підказки. Натисніть на будь-яке місце у воді, щоб закинути вудку. Після цього рибалка зробить закид, і гра розпочнеться. Тепер залишилося чекати, поки риба клюне, і будьте готові її витягнути! </p>
                    </div>

                </div>
                <div className="Instruction__Step2">
                <div className="Instruction__Step1__text">
                            <p className='Instruction__Step1__h1'>Крок 2: Чекайте на клювання.</p>
                            <p className='Instruction__Step1__p'>Після закидання вудки уважно спостерігайте за поплавком, поки риба не клюне. Коли він почне рухатися або занурюватися у воду, підготуйтеся до підсікання.</p>
                    </div>
                <div className="img__Instruction__Step1">
                        <img src={Step2} alt="" srcset="" />

                    </div>
                    
                </div>
                
            </div>
            </div>


        </div>



    </section>  );
}
 
export default Instruction;