data types:

Scene:
Has
Objects
Camera
Bounds

Object: something that exists in the scene. Has some material properties like reflectiveness, brightness, etc. Light sources are objects?
Has
Position
material properties (numbers or vectors idk)
functionality:
distance function
a way to calculate reflections off of surface

Vector:
Has components (numbers)

Camera: has a position and an orientation (quaternion? or just vector)
Has
Position
Direction (vector or maybe quaternion or something)
image plane?
functionality:
move, rotate

Ray:
Has
Position
Direction (vector)
near misses? for fuzz
how long it has travelled (intensity dropoff)

high level overview:
You have a scene containing objects and a camera inside of it.
The camera shoots out rays, many per pixel. Rays hit objects and reflect or whatever until they hit a light source or go out of bounds.

to start, just send out rays, hit things, and color as their color. no light sources, no bounces.
