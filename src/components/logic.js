import React, { useEffect } from "react"
import { useMap, useMapEvents } from "react-leaflet"
import L from "leaflet"
import Locate from "leaflet.locatecontrol"
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css"
import { Helmet } from "react-helmet"

const Logic = ({
  geoJsonKey,
  groupRef,
  clusterRef,
  displayedMarkers,
  setVisibleMarkers,
  children,
}) => {
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

  // Add locate control once the map loads
  useEffect(() => {
    const locateOptions = {
      position: "bottomright",
      // Set other options in here for locate control
      // flyTo: true,
      // drawCircle: false,
      // showPopup: false,
    }
    const locateControl = new Locate(locateOptions)
    locateControl.addTo(map)
  }, [map])

  // Hook to access map events from Leaflet API
  useMapEvents({
    zoomend: () => getVisibleMarkers(),
    moveend: () => getVisibleMarkers(),
  })

  // useEffect Hook to reset viewport when geoJson changes
  useEffect(() => {
    updateMapPosition()
  }, [geoJsonKey]) //eslint-disable-line

  return (
    <>
      <Helmet>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
        />
      </Helmet>
      {children}
    </>
  )
}

export default Logic
