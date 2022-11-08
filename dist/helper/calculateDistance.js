"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(lat, lan) {
    return {
        $multiply: [
            6371 * 2,
            {
                $asin: {
                    $sqrt: {
                        $add: [
                            {
                                $multiply: [
                                    {
                                        $cos: {
                                            $divide: [{ $multiply: [+lat, Math.PI] }, 180],
                                        },
                                    },
                                    {
                                        $cos: {
                                            $divide: [{ $multiply: ["$lat", Math.PI] }, 180],
                                        },
                                    },
                                    {
                                        $pow: [
                                            {
                                                $sin: {
                                                    $divide: [
                                                        {
                                                            $subtract: [
                                                                {
                                                                    $divide: [
                                                                        { $multiply: ["$lan", Math.PI] },
                                                                        180,
                                                                    ],
                                                                },
                                                                {
                                                                    $divide: [
                                                                        { $multiply: [+lan, Math.PI] },
                                                                        180,
                                                                    ],
                                                                },
                                                            ],
                                                        },
                                                        2,
                                                    ],
                                                },
                                            },
                                            2,
                                        ],
                                    },
                                ],
                            },
                            {
                                $pow: [
                                    {
                                        $sin: {
                                            $divide: [
                                                {
                                                    $subtract: [
                                                        {
                                                            $divide: [{ $multiply: ["$lat", Math.PI] }, 180],
                                                        },
                                                        {
                                                            $divide: [{ $multiply: [+lat, Math.PI] }, 180],
                                                        },
                                                    ],
                                                },
                                                2,
                                            ],
                                        },
                                    },
                                    2,
                                ],
                            },
                        ],
                    },
                },
            },
        ],
    };
}
exports.default = default_1;
// Math.asin(
//     Math.sqrt(
//       Math.pow(
//         Math.sin((("$lat" * Math.PI) / 180 - (lat * Math.PI) / 180) / 2),
//         2
//       ) +
//         Math.cos((lat * Math.PI) / 180) *
//           Math.cos(("$lat" * Math.PI) / 180) *
//           Math.pow(
//             Math.sin(
//               (("$lon2" * Math.PI) / 180 - (lan * Math.PI) / 180) / 2
//             ),
//             2
//           )
//     )
//   ),
// lon1 =  lon1 * Math.PI / 180;
// lon2 = lon2 * Math.PI / 180;
// lat1 = lat1 * Math.PI / 180;
// lat2 = lat2 * Math.PI / 180;
// // Haversine formula
// let dlon = lon2 - lon1;
// let dlat = lat2 - lat1;
// let a = Math.pow(Math.sin(dlat / 2), 2)
//          + Math.cos(lat1) * Math.cos(lat2)
//          * Math.pow(Math.sin(dlon / 2),2);
// let c = 2 * Math.asin(Math.sqrt(a));
// // Radius of earth in kilometers. Use 3956
// // for miles
// let r = 6371;
// // calculate the result
// return(c * r);
