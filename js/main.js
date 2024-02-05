mapboxgl.accessToken =
            'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
        let map = new mapboxgl.Map({
            container: 'map', 
            style: 'mapbox://styles/mapbox/dark-v10',
            zoom: 4, 
            minZoom: 4, 
            center: [-100, 40]
        });
        const grades = [0, 50, 100],
            colors = ['rgb(102,0,204)', 'rgb(51,255,153)', 'rgb(255,51,51)'],
            radii = [2, 5, 10];

        map.on('load', () => { 

        map.addSource('us-covid-2020-counts', {
            type: 'geojson',
            data: 'assets/us-covid-2020-counts.geojson'
        });

        map.addLayer({
            'id': 'deaths-point',
            'type': 'circle',
            'source': 'us-covid-2020-counts',
            'paint': {
                    // increase the radii of the circle as mag value increases
                    'circle-radius': {
                        'property': 'deaths',
                        'stops': [
                            [grades[0], radii[0]],
                            [grades[1], radii[1]],
                            [grades[2], radii[2]]
                        ]
                    },
                    // change the color of the circle as mag value increases
                    'circle-color': {
                        'property': 'deaths',
                        'stops': [
                            [grades[0], colors[0]],
                            [grades[1], colors[1]],
                            [grades[2], colors[2]]
                        ]
                    },
                    'circle-stroke-color': 'white',
                    'circle-stroke-width': 1,
                    'circle-opacity': 0.6
                }
        });
        map.on('click', 'deaths-point', (event) => {
                new mapboxgl.Popup()
                    .setLngLat(event.features[0].geometry.coordinates)
                    .setHTML(`<strong>Death Numbers:</strong> ${event.features[0].properties.deaths}`)
                    .addTo(map);
            });
        
        });
        const legend = document.getElementById('legend');
            //set up legend grades and labels
        var labels = ['<strong>Death Numbers</strong>'],
            vbreak;
        //iterate through grades and create a scaled circle and label for each
        for (var i = 0; i < grades.length; i++) {
            vbreak = grades[i];
            // you need to manually adjust the radius of each dot on the legend 
            // in order to make sure the legend can be properly referred to the dot on the map.
            dot_radii = 2 * radii[i];
            labels.push(
                '<p class="break"><i class="dot" style="background:' + colors[i] + '; width: ' + dot_radii +
                'px; height: ' +
                dot_radii + 'px; "></i> <span class="dot-label" style="top: ' + dot_radii / 2 + 'px;">' + vbreak +
                '</span></p>');
        }
            // add the data source
        const source =
            '<p style="text-align: right; font-size:10pt">Source: <a href="https://earthquake.usgs.gov/earthquakes/">USGS</a></p>';
        // combine all the html codes.
        legend.innerHTML = labels.join('') + source;
