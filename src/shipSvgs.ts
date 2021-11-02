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
<svg width="69" height="140" viewBox="0 0 69 140" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<rect x="23" y="93" width="24" height="47" fill="url(#pattern0)"/>
<rect width="69" height="94" fill="url(#pattern1)"/>
<defs>
<pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_103:2315" transform="scale(0.0416667 0.0212766)"/>
</pattern>
<pattern id="pattern1" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image1_103:2315" transform="scale(0.0144928 0.0106383)"/>
</pattern>
<image id="image0_103:2315" width="24" height="47" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAvCAYAAAD5CArtAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAARhSURBVHgBzVfLbiNVED3V3e5uMwlxMixgxWPDFvYIlCVixSew5K9m/oA/GOcLyLBFKO0N0iyCHSEREewuTlXdttuZxONOiMSNrrr7Ps6pOlW3fCM40wuZ4xO9BPAHFJcQ2Du78Dv/842U179qefObFMtLrPIj3FSf4Wb8OZbPPgJOBPqc60/YP+Ce51A9IYaNfSOSEfKcnwp7Ey6Id9iMZhDNSmhWo82fEXyimh/6t2LEJzd0+7jHccT/gJa4iOkzHwhwMVB7t6eTSKVajGWVva9tcSxLe2bvoc0q2+3r4OsMjvvhONacoGBveqAqbjVpc34XtnmElRyo5EeyFLO6ljY7oCeV+O7czZT0hOROZhTTjmDqn+GigUMK36A2q6MC7fJAWj2CtjU3l9Lmh6J56Uas15qBeRIocw9eh0SnsqDVjTFzMS0Nq9x6+x4JpTnEMptom0+kLSaMxSEwEpGSBnVrRxEHM9AJTiXFgI26Tc0tX5y6kXGToDQvShjwsji2QPO7ho8XSYMigDUMNG9cnk4iY3jtbxZYymwWaQI3EjEwrQVtRQRawofGnM+7/kV65ht5NgTCiIfmkUUcJREthYEBK8eFrsT1JXiQb0jQBVyD4JYHNc7lnzRp4GWAJxDVlaesEYWo9BLV2kN0XndycbbpCCLeDDTZZ7bQNri2trnyLumpJk03RiPivex5UHiazvFdBHhDAA/S1Kxwkp7rShCxg1tTvjHJ6iDTqidTGV77+nyj/xaBxyF0N1dfJOvcSgPT2qXsurg3HWiGlxpxszJzfjcBmSX0XJDgJ/egk6dey+Xv9AgklPVY4cY16aCd3U3ARRqSnDlZtRWHzvLOo248vMgoy5hGhVzN3QR2ogv8TJBX+FEamCfb4IDFYLzlUUh1QA8qktieU7lHIniAfuGIu6hmSQQ4ZBkzi+roiB7BLnGFH5iFK3pQbOv/FgEteLVOsREt6snhWdMLspPEgYv133uqv7xNUGx9fSWbBTULoKQ6byXEDpnXzKiyXkJq92Bj9dfyYjdBv1Ei7QCtPJBAWj4lao6f9tIzqcGOdj9BjanXn1TfCa7axg+TlfRUp/T2wbrdsntnvpVGNxm06Olv8Visy8jy7cDuRwAHaBJQ0wuyZVCzJrLgPpigZNkN0GmXqul0W94vUO623lqxc3bMTFriQu2kKvXWuDAwLjOpvDRc4VEEFWYEmfGOg3TbQbrizNXOSfZYD3JKk+EL9gv74baucamaednQxxJY9hj4XwS0u5ImL9SzqOHb4h34acOu9rt+jL+pdYa5WBzigvglZxp8Kv8BQdfe6JzSTHzHNY73AbdWYN82cjkmfl/9cD/wYQRZ6E2NZhjQsr1X2lXEr867i9vDCYAr/99hYBtC0CAyqBmwZxiBhv1PFAPEv1XY43A9lKD7hXs6ghTiZsCeQQSLdO4HeTCoyYIizXWCp2oy1wsMbIOySOXd9f9RBHhygnbYIRvervnj839r/wJLVZqCSW30VgAAAABJRU5ErkJggg=="/>
<image id="image1_103:2315" width="69" height="94" xlink:href="data:image/png;base64,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"/>
</defs>
</svg>

`]