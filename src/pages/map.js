import React, { useState, useEffect, useRef } from "react"
import { MapContainer, TileLayer, GeoJSON, FeatureGroup } from "react-leaflet"
import MarkerClusterGroup from "react-leaflet-markercluster"
import { useHasMounted } from "gatsby-theme-catalyst-core"
import { makeKey } from "../lib/makeKey"
import geojson from "../data/geojson.json"
import Logic from "../components/logic"
import "react-leaflet-markercluster/dist/styles.min.css"
import "../lib/map.css"
import L from "leaflet"

const Map = () => {
  // Initiate map ref
  const groupRef = useRef()
  const clusterRef = useRef()

  // Application State
  // GeoJson Key to handle updating geojson inside react-leaflet
  const [geoJsonKey, setGeoJsonKey] = useState("initialKey123abc")

  //Track which markers are being actively displayed on the map
  const [displayedMarkers, setDisplayedMarkers] = useState(geojson)

  //Track which markers are visible on the map
  const [visibleMarkers, setVisibleMarkers] = useState(geojson)

  // Generate a new key to force an update to GeoJson Layer
  useEffect(() => {
    const newKey = makeKey(10)
    setGeoJsonKey(newKey)
  }, [displayedMarkers])

  // Remove a displayed marker to simulate filtering
  const handleRemove = () => {
    if (displayedMarkers.length > 0) {
      const updatedMarkers = displayedMarkers.slice(0, -1)
      setDisplayedMarkers(updatedMarkers)
    }
  }

  // Filter for two bedrooms only
  const handleFilter = () => {
    if (displayedMarkers.length > 0) {
      const filteredMarkers = displayedMarkers.filter(
        (marker) => marker.properties.bedrooms === 3
      )
      setDisplayedMarkers(filteredMarkers)
    }
  }

  // Reset the map markers
  const handleReset = () => {
    setDisplayedMarkers(geojson)
  }

  //Creating popups for the map
  const createPopups = (feature = {}, layer) => {
    const { properties = {} } = feature
    const { address, price, bedrooms, bathrooms } = properties
    const popup = L.popup()
    const html = `
     <div class="popup-container">
     <h3 class="popup-header">${address.street}</h3>
     <ul>
     <li><strong>Price:</strong> ${price.toString()}</li>
     <li><strong>Bedrooms:</strong> ${bedrooms.toString()}</li>
     <li><strong>Bathrooms:</strong>${bathrooms.toString()}</li>
     </div>
     `
    popup.setContent(html)
    layer.bindPopup(popup)
  }

  return (
    <>
      <header>
        <h1>Advanced mapping with Gatsby and React-Leaflet</h1>
      </header>
      <main style={{ display: "flex" }}>
        <div style={{ flex: "1" }}>
          <div>
            <h2>Simulated filters</h2>
            <button onClick={handleRemove}>Remove one marker</button>
            <button onClick={handleFilter}>Only 3 bedrooms</button>
            <button onClick={handleReset}>Reset markers</button>
          </div>
          <div>
            {useHasMounted && (
              <MapContainer
                center={[51.072806, -114.11918]}
                zoom={10}
                style={{ height: "400px" }}
              >
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Logic
                  geoJsonKey={geoJsonKey}
                  groupRef={groupRef}
                  clusterRef={clusterRef}
                  displayedMarkers={displayedMarkers}
                  setVisibleMarkers={setVisibleMarkers}
                >
                  <FeatureGroup ref={groupRef} name="Homes">
                    <MarkerClusterGroup ref={clusterRef}>
                      <GeoJSON
                        data={displayedMarkers}
                        key={geoJsonKey}
                        onEachFeature={createPopups}
                      />
                    </MarkerClusterGroup>
                  </FeatureGroup>
                </Logic>
              </MapContainer>
            )}
          </div>
        </div>
        <div style={{ flex: "1", marginLeft: "1rem" }}>
          <div>
            <h2>Visible Markers</h2>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {visibleMarkers.map((marker) => (
                <div
                  key={marker.properties.address.street}
                  style={{ padding: "1rem" }}
                >
                  <h3>{marker.properties.address.street}</h3>
                  <ul>
                    <li>Price: {marker.properties.price.toString()}</li>
                    <li>Bedrooms: {marker.properties.bedrooms.toString()}</li>
                    <li>Bathrooms: {marker.properties.bathrooms.toString()}</li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Map
