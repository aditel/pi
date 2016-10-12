# ATMEGA328P AVR 
make
avrdude -p m328p -c gpio -e -U flash:w:build-atmega328/blink.hex
