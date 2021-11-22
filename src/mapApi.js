export const updateMarkers = (mapObj, markers) => {
  let mapBounds = mapObj.getBounds();
  let marker, position;

  for (let i = 0; i < markers.length; i++) {
    marker = markers[i];
    position = marker.getPosition();
    if (mapBounds.hasLatLng(position)) {
      showMarker(mapObj, marker);
    } else {
      hideMarker(mapObj, marker);
    }
  }
};

const showMarker = (mapObj, marker) => {
  if (marker.setMap()) return;
  marker.setMap(mapObj);
};

const hideMarker = (mapObj, marker) => {
  if (!marker.setMap()) return;
  marker.setMap(null);
};
