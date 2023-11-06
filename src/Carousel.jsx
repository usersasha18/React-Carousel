import { useGetData as useData } from "./assets/components/useGetData";
import { useEffect, useState, useRef } from "react";
import "./Slider.css"

export default function Slider() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  /*
    импортируем кастомных хук useGetData/useData
    через axios делаю запрос в data.json
    получаю данные и записываю их в переменную result
    далее записываю весь результат в состояние setData
  */ 
    useEffect(() => {
      const getDataFetcher = async () => {
        const result = await useData('./data.json', "GET");
        setData(result);
      };
    
      if (!loading) {
        getDataFetcher();
        setLoading(true);
      }
  }, [loading]);
  return (
      <>
        {data.length > 0 ? (
          <Carousel data={data} slideToShow={5} speed={2000}/>
        ) : (
          <p>Загрузка данных...</p>
        )}
      </>
  )
}

/**
 * 
 * @param {data}
 * @param {slideToShow}
 * @param {speed}
 * @description функция для вывода карусели 
 * 
 */

function Carousel({ data, slideToShow, speed }) {
  /*
      переменная maxIndex хранит в качестве значения максимально допустимый индекс
      для прокрутки слайдов
      Например у меня 15 слайдов, а slideToShow равен 4, то тогда maxIndex будет равен 11
      Потому что отображаться должно 4 слайда
      ------------------------------------------
      Например: каждая картинка имеет ширишу 100% родительского элемента, а затем она делится на переменную --slide-to-show, чтобы равномерно распределить пространство между слайдами, то есть если значение стоит 3, то каждый слайд будет занимать 1/3  от всей доступной ширины карусели (33%), если 5 то 1/5 (или 20%)
      ------------------------------------------
  */
  const slider = useRef(null)
  const sliderCarousel = useRef(null)
  const [direction, setDirection] = useState();
    const [disabledButton, setDisabledbutton] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    document.documentElement.style.setProperty('--slide-to-show', slideToShow);
  }, [slideToShow]);
  /*
      функции перелистывания слайдов делают вот что:
      Мы записываем в состояние setCurrentIndex индекс активного слайда 
      currentIndex = 0, потом происходит нажатие на кнопку, после этого мы создаем новую переменную newIndex куда и будем записывать новый индекс для отображение слайдов
      Это значит что ты прибаляем к prevInde + slideToShow(3 например) и теперь newIndex равен 3
      Это значит что мы перелистываем на 3 слайда вперед
      после этого мы return возвращаем условие

      Если newIndex больше чем maxIndex, то тогда вы возвращаем 0 и currentIndex опять будет 0, слайдер вернется в начало
      в противном случае мы перелистываем дальше, то есть возвращаем newIndex
      maxIndex == 11, а newIndex увеличивается каждый раз и когда он дойдет до 11, то вернет 0
      
      В функции prevClick происходит тоже самое, только наоборот
      */
     
  
  const nextClick = () => {
    setDirection(-1)
    setDisabledbutton(true)
    const sliderContainer = slider.current;
    const sliderCarouselMain = sliderCarousel.current
    sliderCarouselMain.style.justifyContent = `flex-start`
    sliderContainer.style.transform = `translate(-100%)`;
  };


  const prevClick = () => {
    setDirection(1); // устанавливаю значение 1 для перемещения слайдов назад
    setDisabledbutton(true)
    const sliderContainer = slider.current;
    const sliderCarouselMain = sliderCarousel.current;
  
    //  количество слайдов, которые надо будет сдвинуть
    for (let i = 0; i < slideToShow; i++) {
      // переменная lastSlide хранит в себе последние элементы которые потом будем вставлять 
      // в перед, чтобы был эффект бесконечной прокрутки
      const lastSlide = sliderContainer.lastElementChild;
        // вставляем последние элементы вперед
        sliderContainer.prepend(lastSlide);
    }  
    // передвигаем слайдер на 100 процентов вперед
    sliderContainer.style.transition = "none";
    sliderContainer.style.transform = `translate(-100%)`;
    
    // сброс всем стилей 
    setTimeout(() => {
      sliderContainer.style.transition = "transform .5s linear";
      sliderContainer.style.transform = "translate(0)";
    }, 0);
  };


  const DeleteFirstSlides = () => {
    const sliderContainer = slider.current
    if(direction === -1) {
      for (let i = 0; i < slideToShow; i++) {
        sliderContainer.appendChild(sliderContainer.firstElementChild);   
      } 
    }
    sliderContainer.style.transition = "none";
    sliderContainer.style.transform = 'translate(0)';

    setTimeout(() => {
      setDisabledbutton(false)
      sliderContainer.style.transition = "all .5s linear";
    });

  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      // nextClick(); 
    }, speed);

    return () => {
      clearInterval(intervalId);
    };
  }, [speed, slideToShow]);


  return (
    <div className="wrapper">
      <button onClick={prevClick} ref={buttonRef} disabled={disabledButton}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z"></path></svg>
      </button>
        <div className="carousel" ref={sliderCarousel}>
          <div
            className="inner_carousel"
            onTransitionEnd={DeleteFirstSlides}
            ref={slider}
          >
          {data.map((item, ) => (
            <img
              key={`key-${item.id}`}
              src={item.image}
              alt=""
              style={{
                flex: `0 0 calc(100% / ${(slideToShow)})`,
              }}
            />
          ))}
        </div>
      </div>
    <button onClick={nextClick} ref={buttonRef} disabled={disabledButton}>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path></svg>
    </button>
    </div>
  );
} 