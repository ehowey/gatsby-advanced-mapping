import React, { useState, useEffect, useRef } from "react"
import { MapContainer, TileLayer, GeoJSON, FeatureGroup } from "react-leaflet"
import MarkerClusterGroup from "react-leaflet-markercluster"
import { useHasMounted } from "gatsby-theme-catalyst-core"
import { makeKey } from "../lib/makeKey"
import geojson from "../data/geojson.json"
import "react-leaflet-markercluster/dist/styles.min.css"
import "../lib/map.css"
import L from "leaflet"
import { Helmet } from "react-helmet"
import AddLocate from "../lib/add-locate"
import GetVisibleMarkers from "../lib/get-visible-markers"
import UpdateMapPosition from "../lib/update-map-position"

const Map = () => {
  // REFS
  // Initiate refs to the feature group and cluster group
  const groupRef = useRef()
  const clusterRef = useRef()

  // STATE
  // GeoJson Key to handle updating geojson inside react-leaflet
  const [geoJsonKey, setGeoJsonKey] = useState("initialKey123abc")

  //Track which markers are being actively displayed on the map
  const [displayedMarkers, setDisplayedMarkers] = useState(geojson)

  //Track which markers are visible on the map
  const [visibleMarkers, setVisibleMarkers] = useState(geojson)

  // FUNCTIONS
  // Generate a new key to force an update to GeoJson Layer
  useEffect(() => {
    const newKey = makeKey(10)
    setGeoJsonKey(newKey)
  }, [displayedMarkers])

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

  // Handle creation of clusters and change styles
  const createClusters = (cluster) => {
    const childCount = cluster.getChildCount()
    let size = ""
    if (childCount < 10) {
      size = "small"
    } else if (childCount < 25) {
      size = "medium"
    } else {
      size = "large"
    }
    return L.divIcon({
      html: `<div><span><b>${childCount}</b></span></div>`,
      className: `custom-marker-cluster custom-marker-cluster-${size}`,
      iconSize: new L.point(40, 40),
    })
  }

  // NOT RELEVANT - just some quick button functions
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

  return (
    <>
      <Helmet>
        {/* This is required for the Add Locate functionality but it is better to include you own style sheet instead of FA*/}
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
        />
      </Helmet>
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
                <FeatureGroup ref={groupRef} name="Homes">
                  <MarkerClusterGroup
                    ref={clusterRef}
                    iconCreateFunction={createClusters}
                  >
                    <GeoJSON
                      data={displayedMarkers}
                      key={geoJsonKey}
                      onEachFeature={createPopups}
                    />
                  </MarkerClusterGroup>
                </FeatureGroup>
                <UpdateMapPosition
                  geoJsonKey={geoJsonKey}
                  groupRef={groupRef}
                  displayedMarkers={displayedMarkers}
                />
                <GetVisibleMarkers
                  geoJsonKey={geoJsonKey}
                  groupRef={groupRef}
                  clusterRef={clusterRef}
                  setVisibleMarkers={setVisibleMarkers}
                />
                <AddLocate />
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
