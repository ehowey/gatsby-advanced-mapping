import { useEffect } from "react"
import { useMap } from "react-leaflet"

const UpdateMapViewportLogic = ({ geoJsonKey, groupRef, displayedMarkers }) => {
  // Access the map context with the useMap hook
  const map = useMap()

  // Reset the bounds of the map based on the displayed markers
  const updateMapPosition = () => {
    if (displayedMarkers.length > 0 && map && groupRef.current) {
      const layer = groupRef.current
      if (layer) {
        map.fitBounds(layer.getBounds().pad(0.5))
      }
    }
  }

  // useEffect Hook to reset viewport when geoJson changes
  useEffect(() => {
    updateMapPosition()
  }, [geoJsonKey]) //eslint-disable-line

  return null
}

export default UpdateMapViewportLogic
