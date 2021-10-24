export const ships = [

// Ship 0
`
<svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.2897 13L8 18.6656L5.71027 13L10.2897 13Z" fill="#010101" stroke="white" stroke-linecap="square"/>
<path d="M1.5 16.9L8 1.3L14.5 16.9L8.23529 13.5588L8 13.4333L7.76471 13.5588L1.5 16.9Z" fill="#010101" stroke="white" stroke-linecap="square"/>
</svg>
`,

// Ship 1
`
<svg width="77" height="116" viewBox="0 0 77 116" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<path d="M32 86H44L38 116L32 86Z" fill="#B42222"/>
<rect width="77" height="100" fill="url(#pattern0)"/>
<defs>
<pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_89:9089" transform="scale(0.012987 0.01)"/>
</pattern>
<image id="image0_89:9089" width="77" height="100" xlink:href="data:image/png;base64,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"/>
</defs>
</svg>
`,

// Ship 2
`
<svg width="18" height="23" viewBox="0 0 18 23" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<path d="M8.3793 19.9736H9.62068L8.99999 22.9999L8.3793 19.9736Z" fill="#00E477"/>
<rect width="18" height="20" fill="url(#pattern0)"/>
<defs>
<pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_89:9003" transform="scale(0.0555556 0.05)"/>
</pattern>
<image id="image0_89:9003" width="18" height="20" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAUCAYAAACAl21KAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIUSURBVHgBnZRNSBtREMdnP+Imrkk21NaiQl8tItRDt6SQ0hZcIR56Ug89Z0tpzrk0sb0kXltoD+2lVNCeLaS3FhSiF8VD0JMKgll08RtdhcRojHHfRiUb963RHwy892bmvzP7ZpcCO9ZjKOhon3UArf3LL/RD65c5uA3tG58zpXMCW98zdrE00aMOyDzFIXl3FLC5oA6B+jEEN6Vz62uqVMXdtcEUKZ4lOR4z90TlZA9GcmljH3G/gi7ukfiHEG/dWiYuNDNeAbE+kOv9hgmUE1pojwCZiFB7RY4cwokYLHaBQLsAON6rL7XaKgJGBBKnBcnq2FKoieZ7gQgl1yakD+FrV0cfEAjV+yVYjUnXCnXQjcmQy0/SgQj/Ejq5pri90GosMdDQLSLGRxTCL/yHp1cCNRqxFlqJ9iW8wTi+6uuQuDZIeHq+VbZYFlI/iWH38+G4Owi1gmPfNwSSoH4wbpgyRPhnqZ9C/+Wg4Yl+q41CV12bKXnyeBmGhTem2QprSe1XdrqbCu4M7Y3deWea1pFsGnyME56wzTChJ/vo8nqusKbbut6WufKenSGNbcVjX8XvwzSkGsPGGhXLT8dVYPubn7/SZov+ObELhW0lcTCOKh12t4bR4037xZNNhZ3JLT2dKS57Kx2yM6DYCQ1m/yPTwVFxn7IKxH/GFw5kBGulQ9g/zcOD8yqnCoqydD/6sDrnDK6Cs380Dpx7AAAAAElFTkSuQmCC"/>
</defs>
</svg>
`,

// Ship 3
`
<svg width="16" height="19" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<path d="M7.48386 16.3611H8.51611L7.99999 19L7.48386 16.3611Z" fill="#0500FF"/>
<rect width="16" height="17" fill="url(#pattern0)"/>
<defs>
<pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_89:9049" transform="scale(0.0625 0.0588235)"/>
</pattern>
<image id="image0_89:9049" width="16" height="17" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAARCAYAAADUryzEAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGcSURBVHgBnVJNSwJRFD0Trs1tRDXbSspdoIuGFoWrDNqnPyAqolaBEq0i0IqgKFIhSHLRxx9IoVoVGCi0HHNZlPoHpnOdkVHIMbtwuTPvvXvOfec8wCEMw4gxk05n+uAc/czqvwDIHGLxMFXr+9dwdWiWxhGmzlQEiGuqoij6nwBeXxCPriPcurazjxuWBXS7Apl8Z4dsJm+lDLyXzRlOEghxT+s6QfUL11KHVDMlapaMnx+IsuQ6TkCG8N421GE2jk/KAifQAf80wajI+RE0nlnqCHB6gGiQel+mgTpZ/RoQnDe/MynzTPYCMUvkdgB5NGMTUJcjNmCpYGYznvLAqBcqP1faNBCLdmOIZshc0fl6iO/12XeX/3oNeMwBQjAzi1X2pMVW8RiFZyMZWWy3zSnkSg8lpAYGlYjLYm80b8bI+m2qL+yKqWOjuj32dFtrwN0Vwo0p3orG/W0WGnoI0UKcocg55ThuGILaVF5YnCaQvaIl7AZfRd9UAGkRR0Ckye2xxTNg19Y9AQloFHMOCcVygW7Dg95Cpwv5H684s0bE1OO6AAAAAElFTkSuQmCC"/>
</defs>
</svg>
`]