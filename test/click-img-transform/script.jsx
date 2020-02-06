let count = 0;

function cb(v) {
  document.getElementById('base64').value = v;
}

karas.render(
  <canvas width="360" height="360">
    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkAQMAAABKLAcXAAAABlBMVEX1CAD////Q9ly2AAAAhUlEQVQ4y93TMQ6AIAwF0BIHRo/AUTyaHM2jeARGBoNSkvqNkBASh8YO/rzR9kOqZjllth8pmqc8OSgRWSgSGSjkEL3D53C3KM8sSiwrOlhTW5FlRIFFbe1Fa0v85RyWL3IqNPwPnb109onNd2+Ea+LSzRYg0J66WWhd1Ui0Vc/L+Vaa5gJ+8ifpfqdy4gAAAABJRU5ErkJggg=="
         style={{transform:'translate(100px, 100px)'}} onClick={()=>cb(count++)}/>
  </canvas>,
  '#test'
);
