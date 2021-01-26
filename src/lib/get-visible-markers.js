import { useMap, useMapEvents } from "react-leaflet"
import L from "leaflet"

const GetVisibleMarkersLogic = ({
  groupRef,
  clusterRef,
  setVisibleMarkers,
}) => {
  // Access the map context with the useMap hook
  const map = useMap()

  // Get visible markers on the map
  const getVisibleMarkers = () => {
    if (map && groupRef.current && clusterRef.current) {
      const cluster = clusterRef.current
      let features = []
      cluster.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
          if (map.getBounds().contains(layer.getLatLng())) {
            features.push(layer.feature)
          }
        }
      })
      setVisibleMarkers(features)
    }
  }

  // Hook to access map events from Leaflet API
  useMapEvents({
    zoomend: () => getVisibleMarkers(),
    moveend: () => getVisibleMarkers(),
  })

  return null
}

export default GetVisibleMarkersLogic
