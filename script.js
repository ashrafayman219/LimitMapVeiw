// display variables
var displayMap;
var view;
var gL;
var graphicsLayer;
var url;
var arrayOfDisplayedGraphics = [
  {
    CurrentMethod: "point",
    LocationName: "Location 1",
    LocationPoints: [2883671.710763707, 4670243.505248234],
    Color: "Yellow",
    Data: {
      Id: 1,
      ProjectName: "Project 1",
      SideName: "dd",
      ContractorName: "dd",
      camera: "data",
      IsFuture: true,
    },
  },
  {
    CurrentMethod: "point",
    LocationName: "Location 1",
    LocationPoints: [4783671.710763707, 1370243.505248234],
    Color: "red",
    Data: {
      Id: 6,
      ProjectName: "Project 1",
      SideName: "dd",
      ContractorName: "dd",
      camera: "data",
      IsFuture: true,
    },
  },
  {
    CurrentMethod: "polygon",
    LocationName: "Location 1",
    LocationPoints: [
      [2783671.710763707, 4670243.505248234],
      [2183671.710763707, 4570243.505248234],
      [2283671.710763707, 4370243.505248234],
      [2783671.710763707, 4670243.505248234],
    ],
    Color: "Green",
    Data: {
      Id: 2,
      ProjectName: "Project 2",
      SideName: "polygon",
      ContractorName: "polyg",
      camera: "data",
      IsFuture: false,
    },
  },
];
var sarr = [
  {
    CurrentMethod: "point",
    LocationName: "Location 1",
    LocationPoints: [2583671.710763707, 4370243.505248234],
    Color: "Yellow",
    Data: {
      Id: 64,
      ProjectName: "Project 1",
      SideName: "ggf",
      ContractorName: "dd",
      camera: "data",
    },
  },
  {
    CurrentMethod: "point",
    LocationName: "Location 2",
    LocationPoints: [2583671.710763707, 5370243.505248234],
    Color: "blue",
    Data: {
      Id: 33,
      ProjectName: "Project 2",
      SideName: "vv",
      ContractorName: "dcsa",
      camera: "data",
    },
  },
  {
    CurrentMethod: "point",
    LocationName: "Location 3",
    LocationPoints: [8583671.710763707, 7370243.505248234],
    Color: "green",
    Data: {
      Id: 24,
      ProjectName: "Project 3",
      SideName: "cv",
      ContractorName: "bb",
      camera: "data",
    },
  },
  {
    CurrentMethod: "point",
    LocationName: "Location 4",
    LocationPoints: [4583671.710763707, 2370243.505248234],
    Color: "red",
    Data: {
      Id: 55,
      ProjectName: "Project 4",
      SideName: "ew",
      ContractorName: "xc",
      camera: "data",
    },
  },
];
var pointGraphic;
var polygonGraphic;
var polylineGraphic;
var gra;
var N = 6;
var array = [];
var currentFeat = {
  graphic: {},
  obj: {},
};

var sidePoint = [];
var errorMsg = document.getElementById("errMsg");

function loadModule(moduleName) {
  return new Promise((resolve, reject) => {
    require([moduleName], (module) => {
      if (module) {
        resolve(module);
      } else {
        reject(new Error(`Module not found: ${moduleName}`));
      }
    }, (error) => {
      reject(error);
    });
  });
}

async function initializeMap() {
  try {
    if (!view) {
      const [esriConfig, Map, MapView, intl, GraphicsLayer] = await Promise.all(
        [
          loadModule("esri/config"),
          loadModule("esri/Map"),
          loadModule("esri/views/MapView"),
          loadModule("esri/intl"),
          loadModule("esri/layers/GraphicsLayer"),
        ]
      );

      intl.setLocale("ar");
      esriConfig.apiKey = "AAPK756f006de03e44d28710cb446c8dedb4rkQyhmzX6upFiYPzQT0HNQNMJ5qPyO1TnPDSPXT4EAM_DlQSj20ShRD7vyKa7a1H";

      displayMap = new Map({
        // basemap: "dark-gray-vector",
        basemap: "osm-standard",
      });

      view = new MapView({
        // center: [31.233334, 30.033333], // longitude, latitude, centered on Egypt
        center: [39.82600564584681, 21.42278518229223], // longitude, latitude, centered on Mecca
        container: "displayMap",
        map: displayMap,
        zoom: 16,
        constraints: {
          minZoom: 16 // Use this constraint to avoid zooming out too far
        }
      });

      view.when(function() {
        limitMapView(view);
      });


      gL = new GraphicsLayer({
        title: "طبـقة العرض",
      });
      displayMap.add(gL);

      graphicsLayer = new GraphicsLayer({
        title: "طبـقة الرسـم",
      });
      displayMap.add(graphicsLayer);

      await view.when();

      //add widgets
      addWidgets()
        .then(([view, displayMap]) => {
          console.log("Widgets Returned From Require Scope", view, displayMap);
          // You can work with the view object here
        })
        .catch((error) => {
          // Handle any errors here
        });

      //draw graphics
      drawGraphics()
        .then(([view, displayMap]) => {
          console.log("Array Returned From Require Scope", array);
          // You can work with the view object here
        })
        .catch((error) => {
          // Handle any errors here
        });

      // //intiate graphics
      // getGraphics(arrayOfDisplayedGraphics)
      //   .then(([view, displayMap, gL]) => {
      //     console.log("gL Returned From Require Scope", gra);

      //     // You can work with the view object here
      //   })
      //   .catch((error) => {
      //     // Handle any errors here
      //   });
      // view.when(function () {
      //   view.goTo(
      //     {
      //       target: gra,
      //       // zoom: 13
      //     },
      //     { duration: 4000 }
      //   );
      // });
    }
    return [view, displayMap, gL, array]; // You can return the view object
  } catch (error) {
    console.error("Error initializing map:", error);
    throw error; // Rethrow the error to handle it further, if needed
  }
}
// calling
initializeMap()
  .then(() => {
    console.log("Map Returned From Require Scope", displayMap);
    // You can work with the view object here
  })
  .catch((error) => {
    // Handle any errors here
  });


  async function addWidgets() {
    try {
      // await initializeMap();
  
      const [
        Fullscreen,
        BasemapGallery,
        Expand,
        ScaleBar,
        AreaMeasurement2D,
        Search,
        Home,
        LayerList,
      ] = await Promise.all([
        loadModule("esri/widgets/Fullscreen"),
        loadModule("esri/widgets/BasemapGallery"),
        loadModule("esri/widgets/Expand"),
        loadModule("esri/widgets/ScaleBar"),
        loadModule("esri/widgets/AreaMeasurement2D"),
        loadModule("esri/widgets/Search"),
        loadModule("esri/widgets/Home"),
        loadModule("esri/widgets/LayerList"),
      ]);
  
      var fullscreen = new Fullscreen({
        view: view,
      });
      view.ui.add(fullscreen, "top-right");
  
      var basemapGallery = new BasemapGallery({
        view: view,
      });
  
      var Expand22 = new Expand({
        view: view,
        content: basemapGallery,
        expandIcon: "basemap",
        group: "top-right",
        // expanded: false,
        expandTooltip: "Expand",
        collapseTooltip: "Close",
      });
      view.ui.add([Expand22], { position: "top-right", index: 6 });
  
      var scalebar = new ScaleBar({
        view: view,
        unit: "metric",
      });
      view.ui.add(scalebar, "bottom-right");
  
      var measurementWidget = new AreaMeasurement2D({
        view: view,
      });
      // view.ui.add(measurementWidget, "top-left")
  
      var Expand4 = new Expand({
        view: view,
        content: measurementWidget,
        expandIcon: "measure",
        group: "top-right",
        // expanded: false,
        expandTooltip: "Expand to Measure",
        collapseTooltip: "Close Measure",
      });
      var search = new Search({
        //Add Search widget
        view: view,
      });
      view.ui.add(search, { position: "top-left", index: 0 }); //Add to the map
  
      var homeWidget = new Home({
        view: view,
      });
      view.ui.add(homeWidget, "top-left");
  
      var layerList = new LayerList({
        view: view,
        listItemCreatedFunction: function (event) {
          var item = event.item;
          // displays the legend for each layer list item
          item.panel = {
            content: "legend",
          };
        },
      });
      var Expand5 = new Expand({
        view: view,
        content: layerList,
        expandIcon: "list",
        group: "top-right",
        // expanded: false,
        expandTooltip: "Show Layerlist",
        collapseTooltip: "Close Layerlist",
      });
  
      view.ui.add([Expand5], { position: "top-left", index: 6 });
      view.ui.add([Expand4], { position: "top-left", index: 3 });
  
      await view.when();
      return [view, displayMap]; // You can return the view object
    } catch (error) {
      console.error("Error initializing map:", error);
      throw error; // Rethrow the error to handle it further, if needed
    }
  }

async function drawGraphics() {
  try {
    const [Sketch, FeatureForm] = await Promise.all([
      loadModule("esri/widgets/Sketch"),
      loadModule("esri/widgets/FeatureForm"),
    ]);

    var form;
    var modal = document.getElementById("modal");

    // document.getElementById("btnSave").onclick = function () {
    //     // Fires feature form's submit event.
    //     form.submit();
    //     modal.classList.add("hidden");
    // };

    // document.getElementById("btnCancel").onclick = function () {
    //     modal.classList.add("hidden");
    //     // console.log(res)
    //     if (currentFeat.graphic){
    //         graphicsLayer.remove(currentFeat.graphic);
    //         currentFeat.graphic = {};
    //         currentFeat.obj = {};
    //         array.pop();
    //         document.getElementById("projectName").value = "";
    //         errorMsg.innerHTML = "";
    //     }
    // };

    // var showModal = function() {
    //     // document.getElementById("btnSave").disabled = true;
    //     // // show the modal -
    //     modal.classList.remove("hidden");
    // };

    // form = new FeatureForm({
    //     container: "form",
    //     groupDisplay: "sequential", // only display one group at a time
    //     feature: graphicsLayer, // Pass in feature
    // });

    // form.on("submit", function() {
    //     currentFeat.obj.LocationName = document.getElementById("projectName").value;
    //     document.getElementById("projectName").value = "";
    //     errorMsg.innerHTML = "";
    // });

    var sketch = new Sketch({
      view: view,
      layer: graphicsLayer,
      availableCreateTools: ["polyline", "polygon", "point"],
      // graphic will be selected as soon as it is created
      creationMode: "update",
      updateOnGraphicClick: true,
      visibleElements: {
        createTools: {
          rectangle: false,
          circle: false,
        },
        selectionTools: {
          "lasso-selection": true,
          "rectangle-selection": true,
        },
        settingsMenu: true,
        undoRedoMenu: true,
      },
    });
    view.ui.add(sketch, { position: "top-right", index: 0 });

    var sketchVM = sketch.viewModel;
    sketchVM.updateOnGraphicClick = false;
    sketchVM.defaultUpdateOptions.enableRotation = false;
    sketchVM.defaultUpdateOptions.toggleToolOnClick = false;
    sketchVM.defaultUpdateOptions.tool = null;

    // White fill color with 50% transparency
    var fillColor = [255, 255, 255, 0.5];

    // Red stroke, 1px wide
    var stroke = {
      color: [255, 0, 0],
      width: 1,
    };

    // Override all default symbol colors and sizes
    var pointSymbol = sketch.viewModel.pointSymbol;
    pointSymbol.color = fillColor;
    pointSymbol.outline = stroke;
    pointSymbol.size = 8;

    var polylineSymbol = sketch.viewModel.polylineSymbol;
    polylineSymbol.color = stroke.color;
    polylineSymbol.width = stroke.width;

    var polygonSymbol = sketch.viewModel.polygonSymbol;
    polygonSymbol.color = fillColor;
    polygonSymbol.outline = stroke;

    sketch.on("create", function (e) {
      currentFeat.graphic = e.graphic;
      var geometry = e.graphic.geometry;

      if (e.state === "complete") {
        if (geometry.type === "polygon") {
          PolygonArray = [];
          for (x in geometry.rings) {
            var data = geometry.rings[x];
            for (z in data) {
              PolygonArray.push({
                Latitude: data[z][0],
                Longitude: data[z][1],
              });
            }
          }
          currentFeat.obj = {
            CurrentMethod: geometry.type,
            LocationName: "",
            LocationPoints: PolygonArray,
            idPolygon: new Date().getTime().toString(),
          };
          array.push(currentFeat.obj);
        } else if (geometry.type === "polyline") {
          PolylineArray = [];
          for (x in geometry.paths) {
            var data = geometry.paths[x];
            for (z in data) {
              PolylineArray.push({
                Latitude: data[z][0],
                Longitude: data[z][1],
              });
            }
          }
          currentFeat.obj = {
            CurrentMethod: geometry.type,
            LocationName: "",
            LocationPoints: PolylineArray,
            idPolyline: new Date().getTime().toString(),
          };

          array.push(currentFeat.obj);
        } else if (geometry.type === "point") {
          currentFeat.obj = {
            CurrentMethod: geometry.type,
            LocationName: "",
            LocationPoints: [{ Latitude: geometry.x, Longitude: geometry.y }],
            id: new Date().getTime().toString(),
          };

          array.push(currentFeat.obj);
        } else {
          console.log("No graphics added");
        }
      }
    });

    await view.when();
    return array; // You can return the view object
  } catch (error) {
    console.error("Error initializing map:", error);
    throw error; // Rethrow the error to handle it further, if needed
  }
}





function limitMapView(view) {
  let initialExtent = view.extent;
  console.log(initialExtent);
  let initialZoom = view.zoom;
  console.log(initialZoom);
  view.watch('stationary', function(event) {
    if (!event) {
      return;
    }
    // If the center of the map has moved outside the initial extent,
    // then move back to the initial map position (i.e. initial zoom and extent
    let currentCenter = view.extent.center;
    if (!initialExtent.contains(currentCenter)) {
      view.goTo({
        target: initialExtent,
        zoom: initialZoom
      });
    }
  });
}