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

  draggable = new PlainDraggable(document.getElementById('draggableWindow'));
  draggable.containment = {left: 255.5, top: 0, width: 800, height: 0};
  draggable.onDrag = function(newPosition) {
    if(music.paused){
      music.play();
      music.loop =true
    }
    music.volume =Maths.map(newPosition.left, 255, 600, 0, 1)
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
