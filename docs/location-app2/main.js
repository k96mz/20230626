// Maplibre GL JSの読み込み
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const map = new maplibregl.Map({
  container: 'map', // div要素のid
  zoom: 5, // 初期表示のズーム
  center: [138, 37], // 初期表示の中心
  minZoom: 5, // 最小ズーム
  maxZoom: 18, // 最大ズーム
  maxBounds: [122, 20, 154, 50], // 表示可能な範囲
  style: {
    version: 8,
    glyphs: './fonts/{fontstack}/{range}.pbf', // フォントデータを指定
    sources: {
      // 背景地図ソース
      osm: {
        type: 'raster',
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        maxzoom: 19,
        tileSize: 256,
        attribution: 
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
      skhb: {
        // 医療機関ベクトルタイル
        type: 'vector',
        tiles: [
                  `${location.href.replace('/index.html', '')}/skhb/{z}/{x}/{y}.pbf`,
               ],
        minzoom: 4,
        maxzoom: 10,
        attribution: 
          '<a href="https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-P04-v3_0.html" target="_blank">国土数値情報 医療機関データ</a>',
      },
    },
    layers: [
      // 背景地図レイヤー
      {
        id: 'osm-layer',
        source: 'osm',
        type: 'raster',
      },
      {
        id: 'skhb-layer',
        source: 'skhb',
        'source-layer': 'skhb',
        type: 'circle',
        paint: {
          // 'circle-color': '#6666cc',
          'circle-color': [
            // アイコンの色を属性値によって塗り分ける
            'interpolate',
            ['linear'],
            ['get', 'P04_001'], // P04_001は医療機関分類コードを示す
            1, '#f00', // 病院は赤　病院だけ表示とかしてみてもよい。
            2, '#0f0', // 診療所は緑
            3, '#00f', // 歯科診療所は青
        ],
          'circle-radius': [ // ズームレベルに応じた円の大きさ
            'interpolate',
            ['linear'],
            ['zoom'],
            5,
            2,
            14,
            6,
          ], 
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff',
        },
        //filter: ['get', 'P04_001'],
      },
      // {
      //   id: 'medical-label-layer', // 病院名を表示するレイヤー
      //   source: 'skhb',
      //   type: 'symbol',
      //   minzoom: 12,
      //   layout: {
      //     'text-field':['get', 'P04_002'], // P04_002=病院名
      //     'text-font': ['Noto Sans CJK JP Bold'], // glyphsのフォントデータに含まれるフォントを指定
      //     'text-offset': [0, 0.5], // フォントの位置調整
      //     'text-anchor': 'top', // フォントの位置調整
      //     'text-size': [
      //       'interpolate',
      //       ['linear'],
      //       ['zoom'],
      //       10, // ズームレベル10のときに
      //       8, // フォントサイズ8
      //       14, // ズームレベル14のときに
      //       14, // フォントサイズ14
      //     ],
      //   },
      //   paint: {
      //     'text-halo-width': 1,
      //     'text-halo-color': '#fff',
      //   },
      // },
    ],
  },
});

// マップの初期ロード完了時に発火するイベントを定義
map.on('load', () => {
  // 地図上をクリックした際のイベント
  map.on('click', (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: [
        'skhb-layer',
      ],
    });
    if (features.length === 0) return; // 地物がなければ処理を終了
  });
});