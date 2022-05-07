console.log("hi")
class Maths {
  static norm (value, min, max) { return (value - min) / (max - min) }

  static lerp (norm, min, max) { return (max - min) * norm + min }

  static clamp (value, min, max) { return Math.max(min, Math.min(max, value)) }

  static map (value, sourceMin, sourceMax, destMin, destMax) {
    return this.lerp(this.norm(value, sourceMin, sourceMax), destMin, destMax)
  }
}
const music = new Audio('cloudy_day_audio.mp3');
window.addEventListener('load', async function() {

  window.addEventListener('resize', () => {
    const contL = window.innerWidth * 0.16
    const contW = window.innerWidth * 0.37
    draggable.containment = { left: contL, top: 0, width: contL + contW, height: 0 }
  })

  draggable = new PlainDraggable(document.getElementById('draggableWindow'));
  const contL = window.innerWidth * 0.16
  const contW = window.innerWidth * 0.37
  draggable.containment = {left: contL, top: 0, width: contL + contW, height: 0};
  draggable.onDrag = function(newPosition) {
    if(music.paused){
      music.play();
      music.loop =true
    }
    const minL = draggable.containment.left
   const maxL = draggable.containment.width + minL
   const v = Maths.map(newPosition.left, minL, maxL, 0, 1)
   music.volume = v
  };
  const bg = document.querySelector('.bg')
  const weather = await NWS.getForecast()
  console.log(weather)
  if(weather.temperature > 70 && weather.shortForecast==='Cloudy'){
    alert("its hot")
  } else if(weather.temperature < 50){
    alert("its cold")
    bg.style.backgroundImage='url("cloudy_day.png")'
  } else {
    alert("perf")
  }

});
