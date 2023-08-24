# To Do
* transform coordinates before passing it to the distance function. You have repeater for doing that to an individual shape, but you can also do it to the whole scene
* refraction?
* ambient occlusion thing
* glow
* fractals like code parade
* mandelbrot
* instead of image plane, do an angular thing to mimic the human eye
* problem with transformations is that they only change position. for a rotation, the normals need to rotate the same way
  * normals also need to change for dilations

# Done
* reflective materials
* fix bug with objects towards the edge of the screen. see vertical stack of touching spheres. I don't think it's just an image plane thing. Spheres appear closer than they should.
  * it was just an image plane thing. alleviated by reducing fov from 90 degrees to 70
* shape algebra using (smooth?) min, max, and negated distance functions
