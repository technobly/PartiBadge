
#ifndef TINYFONT_SPRITE_H
#define TINYFONT_SPRITE_H

#ifndef PARTICLE
#include <avr/io.h>
#include <avr/pgmspace.h>
#endif

#ifdef PARTICLE
const unsigned char TINYFONT_SPRITE[] =
#else
const unsigned char PROGMEM TINYFONT_SPRITE[] =
#endif
{
  0x00, 0xb0, 0x00, 0x00, 0xa1, 0x70, 0xe1, 0x50,
  0x96, 0x4f, 0x26, 0x90, 0x0f, 0x1d, 0x07, 0x0c,
  0x00, 0x96, 0x69, 0x00, 0x4a, 0xe4, 0x4a, 0x00,
  0x48, 0x44, 0x40, 0x00, 0x80, 0x68, 0x10, 0x00,
  0x0f, 0x99, 0xfb, 0x8f, 0x9d, 0xbd, 0xbb, 0xfb,
  0x77, 0xd4, 0xd4, 0xdf, 0x1f, 0x1a, 0x1a, 0xfe,
  0x7f, 0x5d, 0x5d, 0xff, 0x80, 0x5a, 0x00, 0x00,
  0xa0, 0xa4, 0xaa, 0x00, 0x10, 0xba, 0x34, 0x00,
  0xff, 0x59, 0x53, 0xf3, 0xff, 0x9b, 0x9b, 0x9e,
  0xff, 0xb9, 0xb9, 0x96, 0xff, 0x95, 0x95, 0xd1,
  0x9f, 0xf4, 0x94, 0x0f, 0xfc, 0x29, 0x5f, 0x91,
  0xff, 0x18, 0x38, 0xf8, 0xff, 0x92, 0x94, 0xff,
  0xff, 0x95, 0xd5, 0xf7, 0xbf, 0xb5, 0xdd, 0xd7,
  0xf1, 0x8f, 0x81, 0xf1, 0xf7, 0x88, 0xc8, 0xf7,
  0x79, 0xc6, 0x46, 0x79, 0x09, 0xfd, 0x9b, 0x09,
  0x01, 0x96, 0xf8, 0x00, 0x82, 0x81, 0x82, 0x80,
  0x50, 0x71, 0x62, 0x00, 0x77, 0x56, 0x56, 0x00,
  0x76, 0x76, 0x37, 0x00, 0xa2, 0xb7, 0x73, 0x01,
  0x07, 0x72, 0x06, 0x00, 0x78, 0x27, 0x50, 0x00,
  0x73, 0x34, 0x74, 0x00, 0x77, 0x51, 0x76, 0x00,
  0x7f, 0x55, 0xf7, 0x00, 0x47, 0x71, 0x10, 0x00,
  0x32, 0x47, 0x72, 0x00, 0x73, 0x64, 0x73, 0x00,
  0x15, 0xa2, 0x75, 0x00, 0x61, 0x67, 0x94, 0x00,
  0x00, 0x9f, 0x60, 0x60, 0xf4, 0xf2, 0xf6, 0xf2,
};

#endif
