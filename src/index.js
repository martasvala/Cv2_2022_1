import "./styles.css"; // keep this here!

// naimportujte vše co je potřeba z BabylonJS
import {
  Engine,
  Scene,
  UniversalCamera,
  MeshBuilder,
  Path3D,
  StandardMaterial,
  DirectionalLight,
  Vector3,
  Axis,
  Space,
  Color3,
  SceneLoader,
  DeviceOrientationCamera,
  Mesh,
  Animation,
  ThinRenderTargetTexture
} from "@babylonjs/core";
import "@babylonjs/inspector";
import { Rectangle } from "@babylonjs/gui";

//canvas je grafické okno, to rozáhneme přes obrazovku
const canvas = document.getElementById("renderCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const engine = new Engine(canvas, true);

//scéna neměnit
const scene = new Scene(engine);
// Default Environment

//vytoření kamery v pozici -5 (dozadu)
const camera = new DeviceOrientationCamera(
  "kamera",
  new Vector3(1, 1, 10),
  scene
);

//zaměřit kameru do středu
camera.setTarget(new Vector3(0, 1, 0));

//spojení kamery a grafikcého okna
camera.attachControl(canvas, true);

//zde přídáme cyklus for

//světlo
const light1 = new DirectionalLight(
  "DirectionalLight",
  new Vector3(-1, -1, -1),
  scene
);

//vytvoření cesty
var points = [];
var n = 450; //počet bodů
var r = 50; //rádius křivky
for (var i = 0; i < n + 1; i++) {
  points.push(
    new Vector3(
      (r + (r / 5) * Math.sin((15 * i * Math.PI) / n)) *
        Math.sin((2 * i * Math.PI) / n),
      0,
      (r + (r / 10) * Math.sin((6 * i * Math.PI) / n)) *
        Math.cos((2 * i * Math.PI) / n)
    )
  );
}
//vykreslení křivky
var track = MeshBuilder.CreateLines("Track", { points });
var freza = MeshBuilder.CreateCylinder("Freza", { diameter: 0.000001 });
SceneLoader.ImportMesh("", "public/", "endmill.glb", scene, function (
  noveModely
) {
  freza = noveModely[0];
  freza.scaling = new Vector3(0.15, 0.15, 0.2);
  freza.position.y = 5;
  freza.rotate(new Vector3(1, 0, 0), Math.PI / 2);
});
//úhly a rotace
var path3D = new Path3D(points);
var normals = path3D.getNormals();
var theta = Math.acos(Vector3.Dot(Axis.Z, normals[0]));
freza.rotate(Axis.X, theta + 5, Space.WORLD);
//animace
var i = 0;
scene.registerAfterRender(function () {
  freza.position.x = points[i].x;
  freza.position.z = points[i].z;
  theta = Math.acos(Vector3.Dot(normals[0], normals[i + 1]));
  var sklopeni = Vector3.Cross(normals[i], normals[i + 1]).y;
  sklopeni = sklopeni / Math.abs(sklopeni);
  freza.rotate(Axis.Y, sklopeni * theta, Space.WORLD);
  i = (i + 1) % (n - 1);
});

// povinné vykreslování
engine.runRenderLoop(function () {
  scene.render();
});
const environment1 = scene.createDefaultEnvironment({
  enableGroundShadow: true
});
// zde uděláme VR prostředí

//scene.debugLayer.show();
