# ATMEGA328P AVR 
make
avrdude -p m328p -c linuxgpio -e -U flash:w:build-atmega328/temperatureTimer.hex
