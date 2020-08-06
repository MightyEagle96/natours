export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoibWlnaHR5ZWFnbGUiLCJhIjoiY2s5enh6bzkzMGI2MTNzcnRkNzU0cDcxMCJ9.bQ-uSbf8te7DFAOHV-lxbg';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mightyeagle/cka0vnajg488z1iqdl71c6sa0',
    center: [-119.232, 34.1222],
    zoom: 7,
  });

  const bounds = new mapboxgl.LngLatBounds();
  locations.forEach((loc) => {
    //Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    //Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    //Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    //Extend map bounds to include current locations
    bounds.extend(loc.coordinates);
  });
  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      right: 100,
      left: 100,
    },
  });
};
