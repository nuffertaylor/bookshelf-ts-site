const colorUtil = require("color-util");
//https://tomekdev.com/posts/sorting-colors-in-js

// Sorting
function colorDistance(color1 : Array<number>, color2 : Array<number>) {
  const x =
    Math.pow(color1[0] - color2[0], 2) +
    Math.pow(color1[1] - color2[1], 2) +
    Math.pow(color1[2] - color2[2], 2);
  return Math.sqrt(x);
}
interface clusterItem {
  name : string,
  leadColor : Array<number>,
  colors : Array<any>
}
const clusters : Array<clusterItem> = [
  { name: 'red', leadColor: [255, 0, 0], colors: [] },
  { name: 'orange', leadColor: [255, 128, 0], colors: [] },
  { name: 'yellow', leadColor: [255, 255, 0], colors: [] },
  { name: 'chartreuse', leadColor: [128, 255, 0], colors: [] },
  { name: 'green', leadColor: [0, 255, 0], colors: [] },
  { name: 'spring green', leadColor: [0, 255, 128], colors: [] },
  { name: 'cyan', leadColor: [0, 255, 255], colors: [] },
  { name: 'azure', leadColor: [0, 127, 255], colors: [] },
  { name: 'blue', leadColor: [0, 0, 255], colors: [] },
  { name: 'violet', leadColor: [127, 0, 255], colors: [] },
  { name: 'magenta', leadColor: [255, 0, 255], colors: [] },
  { name: 'rose', leadColor: [255, 0, 128], colors: [] },
  { name: 'black', leadColor: [0, 0, 0], colors: [] },
  { name: 'grey', leadColor: [235, 235, 235], colors: [] },
  { name: 'white', leadColor: [255, 255, 255], colors: [] },
];

function oneDimensionSorting(colors : any, dim : string) {
  return colors
    .sort((colorA : any, colorB : any) => {
      if (colorA.hsl[dim] < colorB.hsl[dim]) {
        return -1;
      } else if (colorA.hsl[dim] > colorB.hsl[dim]) {
        return 1;
      } else {
        return 0;
      }
    });
}

function sortWithClusters(colorsToSort : Array<string>) {
  const mappedColors = colorsToSort.map(colorUtil.color);
  
  mappedColors.forEach((color : any) => {
    let minDistance : any;
    let minDistanceClusterIndex : number | null = null;
    
    clusters.forEach((cluster, clusterIndex) => {
      const colorRgbArr = [color.rgb.r, color.rgb.g, color.rgb.b];
      const distance = colorDistance(colorRgbArr, cluster.leadColor);
      if (typeof minDistance === 'undefined' || minDistance > distance) {
        minDistance = distance;
        minDistanceClusterIndex = clusterIndex;
      }
    });
    if(minDistanceClusterIndex != null) clusters[minDistanceClusterIndex].colors.push(color);
  });
  
  clusters.forEach((cluster) => {
    const dim : string = ['white', 'grey', 'black'].includes(cluster.name) ? 'l' : 's';
    cluster.colors = oneDimensionSorting(cluster.colors, dim)
  });

  return clusters;
}
export const sort_by_color = (colors : Array<string>) => {
  const sortedClusters = sortWithClusters(colors);
  const sortedColors = sortedClusters.reduce((acc : Array<string>, curr : any) => {
    const colors = curr.colors.map((color : any) => color.hex);
    return [...acc, ...colors];
  }, []);
  return sortedColors;
};
