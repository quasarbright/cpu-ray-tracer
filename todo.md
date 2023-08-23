# To Do
* transform coordinates before passing it to the distance function. You have repeater for doing that to an individual shape, but you can also do it to the whole scene
* light sources, emissivity, shading
* refraction?
* ambient occlusion thing
* glow
* fractals like code parade
* mandelbrot
* instead of image plane, to an angular thing to mimic the human eye

# Done
* reflective materials
* fix bug with objects towards the edge of the screen. see vertical stack of touching spheres. I don't think it's just an image plane thing. Spheres appear closer than they should.
  * it was just an image plane thing. alleviated by reducing fov from 90 degrees to 70
