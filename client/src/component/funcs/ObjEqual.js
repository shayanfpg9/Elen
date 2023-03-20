export default function equal(obj1, obj2) {
  obj1 = JSON.stringify(obj1);
  obj2 = JSON.stringify(obj2);

  //when you convert anything to JSON you get a string...
  return obj1 === obj2;
}
