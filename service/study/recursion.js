// 到达n阶梯，
// 有两种可能，第一种n-1,1和第二种n-2
// n-1有两种可能n-2,1,n-3,2
// ---
// 1，2
function jump(n) {
    if(n < 1) {
        return 0;
    }
    if(n === 1) {
        return 1;
    }
    if(n === 2) {
        return 2;
    }
    return jump(n - 1) + jump(n - 2);
}
console.log(jump(3));
// jump(n) = jump(n-1) + jump(n-2) + jump(1);
// jump(n - 1) = jump(n - 2) + jump(n -3);
function sort(arr) {
    let count = 0;
    for(let i = 0; i < arr.length - 1; i++) {
        for(let j = i + 1; j < arr.length; j++) {
            if(arr[i] > arr[j]) {
                count++;
            }
        }
        
    }
    return count;
}
// 时间复杂度O(n*2)
console.log(sort([3,2,1]));
// function bubbleSort(array) {
//     for (let first = 0, len = array.length; first < len; first++) {
//       let isSorted = true;
  
//       for (let second = 0; second < len - first - 1; second++) {
//         if (array[second] > array[second + 1]) { // 比较两个数
//           let temp = array[second];
//           array[second] = array[second + 1]
//           array[second + 1] = temp;
//           isSorted = false;
//         }
//       }
  
//       if (isSorted) {
//         break;
//       }
//     }
  
//     return array;
//   }
//   function selectionSort(array) {
//     const len = array.length;
  
//     for (let i = 0; i < len - 1; i++) {
//       let min = i;
  
//       for (let j = i + 1; j < len; j++) {
//         if (array[min] > array[j]) {
//           min = j; // 找到最小的值,放在最后
//         }
//       }
  
//       [ array[min], array[i] ] = [ array[i], array[min] ];
//     }
  
//     return array;
//   }
  
function bubbleSort(arr) {
    for(let i = 0; i < arr.length; i++) {
        for(let j = i + 1; j < arr.length; j++) {
            
        }
    }
}