// To do:
// - Auto select owner for creating a card
// - Somehow integrate my error grab system into the card creation?

// ==UserScript==
// @name         OptiFleet Additions (Dev)
// @namespace    http://tampermonkey.net/
// @version      5.6.3
// @description  Adds various features to the OptiFleet website to add additional functionality.
// @author       Matthew Axtell
// @match        *://*/*
// @exclude      https://webshell.suite.office.com/*
// @icon         https://foundryoptifleet.com/img/favicon-32x32.png
// @updateURL    https://raw.githubusercontent.com/Sufficingpit29/FoundryScript/main/OptiFleet.js
// @downloadURL  https://raw.githubusercontent.com/Sufficingpit29/FoundryScript/main/OptiFleet.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      *
// @connect 10.6.68.112
// @connect 10.6.68.118
// @connect 10.6.68.119
// @connect 10.6.69.21
// @connect 10.6.69.1
// @connect 10.6.68.249
// @connect 10.6.68.73
// @connect 10.6.68.93
// @connect 10.6.68.76
// @connect 10.6.68.88
// @connect 10.6.69.20
// @connect 10.6.68.97
// @connect 10.6.68.230
// @connect 10.6.68.95
// @connect 10.6.68.211
// @connect 10.6.68.108
// @connect 10.6.68.203
// @connect 10.6.68.231
// @connect 10.6.68.62
// @connect 10.6.68.218
// @connect 10.6.68.204
// @connect 10.6.68.210
// @connect 10.6.68.100
// @connect 10.6.69.23
// @connect 10.6.68.228
// @connect 10.6.68.115
// @connect 10.6.68.57
// @connect 10.6.68.217
// @connect 10.6.68.131
// @connect 10.6.69.24
// @connect 10.6.68.106
// @connect 10.6.68.94
// @connect 10.6.68.96
// @connect 10.6.68.250
// @connect 10.6.68.111
// @connect 10.6.68.87
// @connect 10.6.68.49
// @connect 10.6.68.77
// @connect 10.6.69.8
// @connect 10.6.68.120
// @connect 10.6.68.101
// @connect 10.6.68.98
// @connect 10.6.69.6
// @connect 10.6.69.5
// @connect 10.6.69.2
// @connect 10.6.68.64
// @connect 10.6.68.254
// @connect 10.6.68.242
// @connect 10.6.68.109
// @connect 10.6.68.222
// @connect 10.6.68.104
// @connect 10.6.68.99
// @connect 10.6.68.107
// @connect 10.6.69.4
// @connect 10.6.68.243
// @connect 10.6.69.169
// @connect 10.6.68.85
// @connect 10.6.68.103
// @connect 10.6.69.10
// @connect 10.6.69.18
// @connect 10.6.68.92
// @connect 10.6.68.224
// @connect 10.6.69.16
// @connect 10.6.68.140
// @connect 10.6.69.159
// @connect 10.6.68.234
// @connect 10.6.68.105
// @connect 10.6.69.12
// @connect 10.6.68.157
// @connect 10.6.68.69
// @connect 10.6.68.122
// @connect 10.6.69.106
// @connect 10.6.68.110
// @connect 10.6.68.232
// @connect 10.6.69.87
// @connect 10.6.68.223
// @connect 10.6.69.119
// @connect 10.6.69.19
// @connect 10.6.68.236
// @connect 10.6.68.23
// @connect 10.6.68.5
// @connect 10.6.68.86
// @connect 10.6.69.78
// @connect 10.6.69.105
// @connect 10.6.69.81
// @connect 10.6.69.73
// @connect 10.6.69.107
// @connect 10.6.69.127
// @connect 10.6.68.102
// @connect 10.6.68.130
// @connect 10.6.68.225
// @connect 10.6.69.7
// @connect 10.6.68.30
// @connect 10.6.68.127
// @connect 10.6.68.63
// @connect 10.6.68.124
// @connect 10.6.68.65
// @connect 10.6.68.253
// @connect 10.6.69.90
// @connect 10.6.69.77
// @connect 10.6.69.138
// @connect 10.6.68.13
// @connect 10.6.68.133
// @connect 10.6.69.162
// @connect 10.6.68.15
// @connect 10.6.68.91
// @connect 10.6.69.124
// @connect 10.6.68.26
// @connect 10.6.68.205
// @connect 10.6.68.214
// @connect 10.6.69.170
// @connect 10.6.69.136
// @connect 10.6.68.212
// @connect 10.6.68.202
// @connect 10.6.68.50
// @connect 10.6.69.91
// @connect 10.6.68.208
// @connect 10.6.69.118
// @connect 10.6.69.32
// @connect 10.6.69.126
// @connect 10.6.68.132
// @connect 10.6.69.133
// @connect 10.6.69.132
// @connect 10.6.69.71
// @connect 10.6.68.56
// @connect 10.6.69.120
// @connect 10.6.68.14
// @connect 10.6.68.46
// @connect 10.6.68.70
// @connect 10.6.68.199
// @connect 10.6.68.219
// @connect 10.6.74.41
// @connect 10.6.69.98
// @connect 10.6.68.227
// @connect 10.6.68.221
// @connect 10.6.69.17
// @connect 10.6.69.74
// @connect 10.6.68.113
// @connect 10.6.68.255
// @connect 10.6.68.134
// @connect 10.6.68.220
// @connect 10.6.69.88
// @connect 10.6.68.252
// @connect 10.6.69.131
// @connect 10.6.68.229
// @connect 10.6.69.157
// @connect 10.6.69.139
// @connect 10.6.69.122
// @connect 10.6.68.251
// @connect 10.6.68.244
// @connect 10.6.68.83
// @connect 10.6.69.65
// @connect 10.6.68.44
// @connect 10.6.69.36
// @connect 10.6.68.17
// @connect 10.6.69.0
// @connect 10.6.69.93
// @connect 10.6.69.15
// @connect 10.6.68.238
// @connect 10.6.68.51
// @connect 10.6.69.3
// @connect 10.6.68.137
// @connect 10.6.69.67
// @connect 10.6.68.68
// @connect 10.6.68.128
// @connect 10.6.69.48
// @connect 10.6.68.235
// @connect 10.6.68.215
// @connect 10.6.69.69
// @connect 10.6.68.47
// @connect 10.6.68.52
// @connect 10.6.69.100
// @connect 10.6.68.20
// @connect 10.6.68.55
// @connect 10.6.69.144
// @connect 10.6.68.45
// @connect 10.6.68.233
// @connect 10.6.69.129
// @connect 10.6.69.84
// @connect 10.6.68.67
// @connect 10.6.68.19
// @connect 10.6.68.237
// @connect 10.6.68.129
// @connect 10.6.68.226
// @connect 10.6.68.71
// @connect 10.6.69.80
// @connect 10.6.68.84
// @connect 10.6.68.58
// @connect 10.6.68.36
// @connect 10.6.69.83
// @connect 10.6.69.11
// @connect 10.6.69.99
// @connect 10.6.69.123
// @connect 10.6.69.75
// @connect 10.6.69.14
// @connect 10.6.69.68
// @connect 10.6.69.128
// @connect 10.6.68.22
// @connect 10.6.69.13
// @connect 10.6.69.82
// @connect 10.6.69.66
// @connect 10.6.68.16
// @connect 10.6.69.140
// @connect 10.6.68.80
// @connect 10.6.69.76
// @connect 10.6.68.12
// @connect 10.6.68.48
// @connect 10.6.69.112
// @connect 10.6.68.158
// @connect 10.6.69.96
// @connect 10.6.69.109
// @connect 10.6.69.108
// @connect 10.6.68.42
// @connect 10.6.69.114
// @connect 10.6.69.101
// @connect 10.6.74.8
// @connect 10.6.69.143
// @connect 10.6.69.160
// @connect 10.6.69.117
// @connect 10.6.68.116
// @connect 10.6.68.89
// @connect 10.6.68.207
// @connect 10.6.68.66
// @connect 10.6.69.22
// @connect 10.6.69.44
// @connect 10.6.69.29
// @connect 10.6.69.45
// @connect 10.6.69.47
// @connect 10.6.69.35
// @connect 10.6.69.43
// @connect 10.6.68.38
// @connect 10.6.68.24
// @connect 10.6.69.31
// @connect 10.6.68.43
// @connect 10.6.69.40
// @connect 10.6.68.32
// @connect 10.6.69.38
// @connect 10.6.68.29
// @connect 10.6.68.40
// @connect 10.6.68.21
// @connect 10.6.69.41
// @connect 10.6.69.34
// @connect 10.6.68.28
// @connect 10.6.69.42
// @connect 10.6.68.25
// @connect 10.6.68.34
// @connect 10.6.69.39
// @connect 10.6.68.37
// @connect 10.6.68.39
// @connect 10.6.69.37
// @connect 10.6.69.141
// @connect 10.6.69.125
// @connect 10.6.68.75
// @connect 10.6.69.147
// @connect 10.6.69.104
// @connect 10.6.69.148
// @connect 10.6.69.149
// @connect 10.6.69.113
// @connect 10.6.69.158
// @connect 10.6.69.111
// @connect 10.6.69.151
// @connect 10.6.69.145
// @connect 10.6.69.150
// @connect 10.6.69.156
// @connect 10.6.69.121
// @connect 10.6.69.154
// @connect 10.6.69.146
// @connect 10.6.69.89
// @connect 10.6.69.116
// @connect 10.6.69.152
// @connect 10.6.69.153
// @connect 10.6.69.55
// @connect 10.6.68.206
// @connect 10.6.69.163
// @connect 10.6.68.123
// @connect 10.6.69.79
// @connect 10.6.69.135
// @connect 10.6.69.155
// @connect 10.6.69.142
// @connect 10.6.68.90
// @connect 10.6.68.35
// @connect 10.6.68.141
// @connect 10.6.68.33
// @connect 10.6.68.125
// @connect 10.6.69.9
// @connect 10.6.68.81
// @connect 10.6.68.209
// @connect 10.6.68.59
// @connect 10.6.68.79
// @connect 10.6.68.74
// @connect 10.6.68.54
// @connect 10.6.69.97
// @connect 10.6.68.136
// @connect 10.6.68.53
// @connect 10.6.68.60
// @connect 10.6.68.61
// @connect 10.6.68.240
// @connect 10.6.68.117
// @connect 10.6.68.139
// @connect 10.6.69.161
// @connect 10.6.69.166
// @connect 10.6.69.172
// @connect 10.6.69.173
// @connect 10.6.69.177
// @connect 10.6.69.175
// @connect 10.6.69.164
// @connect 10.6.69.171
// @connect 10.6.69.174
// @connect 10.6.69.178
// @connect 10.6.69.165
// @connect 10.6.69.176
// @connect 10.6.69.185
// @connect 10.6.69.184
// @connect 10.6.69.179
// @connect 10.6.69.182
// @connect 10.6.69.134
// @connect 10.6.69.180
// @connect 10.6.68.82
// @connect 10.6.69.181
// @connect 10.6.69.213
// @connect 10.6.69.217
// @connect 10.6.69.187
// @connect 10.6.69.205
// @connect 10.6.69.201
// @connect 10.6.69.209
// @connect 10.6.69.200
// @connect 10.6.69.203
// @connect 10.6.69.214
// @connect 10.6.69.216
// @connect 10.6.69.197
// @connect 10.6.69.198
// @connect 10.6.69.202
// @connect 10.6.69.137
// @connect 10.6.69.195
// @connect 10.6.69.208
// @connect 10.6.69.188
// @connect 10.6.69.210
// @connect 10.6.69.199
// @connect 10.6.69.196
// @connect 10.6.69.190
// @connect 10.6.69.206
// @connect 10.6.69.189
// @connect 10.6.69.211
// @connect 10.6.69.191
// @connect 10.6.69.215
// @connect 10.6.69.212
// @connect 10.6.69.207
// @connect 10.6.69.194
// @connect 10.6.69.193
// @connect 10.6.69.204
// @connect 10.6.69.228
// @connect 10.6.69.224
// @connect 10.6.69.231
// @connect 10.6.69.236
// @connect 10.6.69.229
// @connect 10.6.69.110
// @connect 10.6.69.219
// @connect 10.6.69.232
// @connect 10.6.69.234
// @connect 10.6.69.222
// @connect 10.6.69.235
// @connect 10.6.69.230
// @connect 10.6.69.221
// @connect 10.6.69.218
// @connect 10.6.69.220
// @connect 10.6.69.226
// @connect 10.6.68.151
// @connect 10.6.69.183
// @connect 10.6.69.233
// @connect 10.6.69.253
// @connect 10.6.70.0
// @connect 10.6.69.251
// @connect 10.6.69.240
// @connect 10.6.69.248
// @connect 10.6.69.255
// @connect 10.6.69.243
// @connect 10.6.69.249
// @connect 10.6.69.245
// @connect 10.6.69.246
// @connect 10.6.69.241
// @connect 10.6.69.244
// @connect 10.6.70.2
// @connect 10.6.70.1
// @connect 10.6.68.78
// @connect 10.6.69.239
// @connect 10.6.69.254
// @connect 10.6.69.250
// @connect 10.6.69.252
// @connect 10.6.69.242
// @connect 10.6.69.247
// @connect 10.6.70.6
// @connect 10.6.70.5
// @connect 10.6.70.3
// @connect 10.6.70.9
// @connect 10.6.68.245
// @connect 10.6.70.10
// @connect 10.6.70.4
// @connect 10.6.70.26
// @connect 10.6.70.31
// @connect 10.6.70.32
// @connect 10.6.70.34
// @connect 10.6.70.16
// @connect 10.6.70.18
// @connect 10.6.70.23
// @connect 10.6.70.33
// @connect 10.6.68.179
// @connect 10.6.70.22
// @connect 10.6.70.19
// @connect 10.6.70.28
// @connect 10.6.70.27
// @connect 10.6.70.11
// @connect 10.6.70.29
// @connect 10.6.70.20
// @connect 10.6.70.17
// @connect 10.6.69.70
// @connect 10.6.70.12
// @connect 10.6.70.13
// @connect 10.6.70.14
// @connect 10.6.70.30
// @connect 10.6.70.21
// @connect 10.6.69.64
// @connect 10.6.70.50
// @connect 10.6.70.40
// @connect 10.6.70.49
// @connect 10.6.70.42
// @connect 10.6.70.37
// @connect 10.6.70.44
// @connect 10.6.70.38
// @connect 10.6.70.45
// @connect 10.6.70.47
// @connect 10.6.70.36
// @connect 10.6.70.46
// @connect 10.6.70.35
// @connect 10.6.70.39
// @connect 10.6.70.43
// @connect 10.6.70.48
// @connect 10.6.70.41
// @connect 10.6.72.35
// @connect 10.6.72.27
// @connect 10.6.72.40
// @connect 10.6.72.20
// @connect 10.6.72.38
// @connect 10.6.72.25
// @connect 10.6.72.33
// @connect 10.6.72.28
// @connect 10.6.72.13
// @connect 10.6.72.32
// @connect 10.6.72.8
// @connect 10.6.73.32
// @connect 10.6.72.30
// @connect 10.6.72.26
// @connect 10.6.72.36
// @connect 10.6.72.37
// @connect 10.6.72.22
// @connect 10.6.72.31
// @connect 10.6.72.7
// @connect 10.6.72.3
// @connect 10.6.72.34
// @connect 10.6.72.19
// @connect 10.6.72.16
// @connect 10.6.72.9
// @connect 10.6.72.17
// @connect 10.6.72.12
// @connect 10.6.72.5
// @connect 10.6.72.41
// @connect 10.6.72.6
// @connect 10.6.72.39
// @connect 10.6.72.21
// @connect 10.6.72.15
// @connect 10.6.72.2
// @connect 10.6.72.14
// @connect 10.6.72.18
// @connect 10.6.72.4
// @connect 10.6.72.23
// @connect 10.6.72.29
// @connect 10.6.72.10
// @connect 10.6.72.69
// @connect 10.6.72.47
// @connect 10.6.72.43
// @connect 10.6.72.54
// @connect 10.6.72.49
// @connect 10.6.72.46
// @connect 10.6.72.57
// @connect 10.6.72.51
// @connect 10.6.72.45
// @connect 10.6.72.64
// @connect 10.6.72.44
// @connect 10.6.72.48
// @connect 10.6.72.50
// @connect 10.6.72.55
// @connect 10.6.72.60
// @connect 10.6.72.61
// @connect 10.6.72.107
// @connect 10.6.72.68
// @connect 10.6.72.66
// @connect 10.6.72.59
// @connect 10.6.72.65
// @connect 10.6.73.60
// @connect 10.6.72.67
// @connect 10.6.72.58
// @connect 10.6.73.147
// @connect 10.6.72.53
// @connect 10.6.72.52
// @connect 10.6.72.62
// @connect 10.6.72.86
// @connect 10.6.72.81
// @connect 10.6.72.75
// @connect 10.6.72.71
// @connect 10.6.72.84
// @connect 10.6.72.76
// @connect 10.6.72.83
// @connect 10.6.72.79
// @connect 10.6.72.73
// @connect 10.6.73.108
// @connect 10.6.72.72
// @connect 10.6.72.70
// @connect 10.6.72.77
// @connect 10.6.72.85
// @connect 10.6.72.82
// @connect 10.6.72.74
// @connect 10.6.72.80
// @connect 10.6.72.96
// @connect 10.6.72.112
// @connect 10.6.72.103
// @connect 10.6.72.100
// @connect 10.6.72.95
// @connect 10.6.72.106
// @connect 10.6.72.102
// @connect 10.6.72.92
// @connect 10.6.72.94
// @connect 10.6.72.99
// @connect 10.6.72.87
// @connect 10.6.72.88
// @connect 10.6.72.93
// @connect 10.6.72.91
// @connect 10.6.72.109
// @connect 10.6.72.98
// @connect 10.6.72.89
// @connect 10.6.68.152
// @connect 10.6.72.110
// @connect 10.6.72.97
// @connect 10.6.72.108
// @connect 10.6.72.101
// @connect 10.6.72.104
// @connect 10.6.72.90
// @connect 10.6.73.48
// @connect 10.6.72.111
// @connect 10.6.72.113
// @connect 10.6.72.120
// @connect 10.6.72.119
// @connect 10.6.72.116
// @connect 10.6.72.114
// @connect 10.6.72.118
// @connect 10.6.72.115
// @connect 10.6.72.132
// @connect 10.6.72.129
// @connect 10.6.72.130
// @connect 10.6.72.126
// @connect 10.6.72.127
// @connect 10.6.72.123
// @connect 10.6.72.125
// @connect 10.6.72.128
// @connect 10.6.72.131
// @connect 10.6.72.122
// @connect 10.6.72.124
// @connect 10.6.72.121
// @connect 10.6.72.135
// @connect 10.6.72.133
// @connect 10.6.72.134
// @connect 10.6.72.136
// @connect 10.6.72.137
// @connect 10.6.72.138
// @connect 10.6.72.140
// @connect 10.6.72.172
// @connect 10.6.72.141
// @connect 10.6.72.173
// @connect 10.6.72.142
// @connect 10.6.72.143
// @connect 10.6.72.157
// @connect 10.6.72.158
// @connect 10.6.72.139
// @connect 10.6.72.171
// @connect 10.6.72.145
// @connect 10.6.72.150
// @connect 10.6.72.167
// @connect 10.6.72.152
// @connect 10.6.72.159
// @connect 10.6.72.155
// @connect 10.6.72.162
// @connect 10.6.72.144
// @connect 10.6.72.168
// @connect 10.6.72.147
// @connect 10.6.72.170
// @connect 10.6.72.166
// @connect 10.6.72.164
// @connect 10.6.72.169
// @connect 10.6.72.149
// @connect 10.6.72.153
// @connect 10.6.72.161
// @connect 10.6.72.148
// @connect 10.6.72.11
// @connect 10.6.72.156
// @connect 10.6.72.160
// @connect 10.6.72.146
// @connect 10.6.72.165
// @connect 10.6.72.151
// @connect 10.6.72.192
// @connect 10.6.72.186
// @connect 10.6.72.176
// @connect 10.6.72.185
// @connect 10.6.72.177
// @connect 10.6.72.175
// @connect 10.6.72.174
// @connect 10.6.72.188
// @connect 10.6.72.197
// @connect 10.6.72.187
// @connect 10.6.72.190
// @connect 10.6.72.199
// @connect 10.6.72.195
// @connect 10.6.72.180
// @connect 10.6.72.198
// @connect 10.6.72.183
// @connect 10.6.72.179
// @connect 10.6.72.196
// @connect 10.6.72.193
// @connect 10.6.72.184
// @connect 10.6.72.178
// @connect 10.6.72.194
// @connect 10.6.72.191
// @connect 10.6.72.189
// @connect 10.6.72.182
// @connect 10.6.72.181
// @connect 10.6.72.210
// @connect 10.6.72.206
// @connect 10.6.72.207
// @connect 10.6.72.202
// @connect 10.6.72.200
// @connect 10.6.72.208
// @connect 10.6.72.209
// @connect 10.6.72.201
// @connect 10.6.72.205
// @connect 10.6.72.203
// @connect 10.6.72.204
// @connect 10.6.72.227
// @connect 10.6.72.222
// @connect 10.6.72.211
// @connect 10.6.72.226
// @connect 10.6.72.230
// @connect 10.6.72.215
// @connect 10.6.72.224
// @connect 10.6.72.219
// @connect 10.6.72.221
// @connect 10.6.72.213
// @connect 10.6.72.225
// @connect 10.6.72.232
// @connect 10.6.72.216
// @connect 10.6.72.217
// @connect 10.6.72.218
// @connect 10.6.72.223
// @connect 10.6.72.214
// @connect 10.6.72.212
// @connect 10.6.72.220
// @connect 10.6.72.228
// @connect 10.6.72.231
// @connect 10.6.72.229
// @connect 10.6.72.238
// @connect 10.6.72.235
// @connect 10.6.72.234
// @connect 10.6.72.237
// @connect 10.6.72.236
// @connect 10.6.72.233
// @connect 10.6.73.9
// @connect 10.6.73.3
// @connect 10.6.73.1
// @connect 10.6.72.251
// @connect 10.6.73.10
// @connect 10.6.72.255
// @connect 10.6.72.250
// @connect 10.6.73.0
// @connect 10.6.73.8
// @connect 10.6.72.239
// @connect 10.6.72.254
// @connect 10.6.72.249
// @connect 10.6.72.244
// @connect 10.6.72.246
// @connect 10.6.73.5
// @connect 10.6.73.7
// @connect 10.6.72.243
// @connect 10.6.73.76
// @connect 10.6.72.241
// @connect 10.6.72.240
// @connect 10.6.72.242
// @connect 10.6.72.245
// @connect 10.6.73.4
// @connect 10.6.72.252
// @connect 10.6.72.248
// @connect 10.6.73.2
// @connect 10.6.73.6
// @connect 10.6.72.253
// @connect 10.6.73.21
// @connect 10.6.73.12
// @connect 10.6.73.13
// @connect 10.6.73.14
// @connect 10.6.73.17
// @connect 10.6.73.11
// @connect 10.6.73.16
// @connect 10.6.73.15
// @connect 10.6.73.19
// @connect 10.6.73.20
// @connect 10.6.73.33
// @connect 10.6.73.39
// @connect 10.6.73.24
// @connect 10.6.73.29
// @connect 10.6.73.30
// @connect 10.6.73.37
// @connect 10.6.73.31
// @connect 10.6.73.23
// @connect 10.6.73.27
// @connect 10.6.73.26
// @connect 10.6.73.28
// @connect 10.6.73.25
// @connect 10.6.73.38
// @connect 10.6.73.22
// @connect 10.6.73.36
// @connect 10.6.73.35
// @connect 10.6.73.192
// @connect 10.6.72.42
// @connect 10.6.73.52
// @connect 10.6.73.44
// @connect 10.6.73.41
// @connect 10.6.73.49
// @connect 10.6.73.50
// @connect 10.6.73.42
// @connect 10.6.73.47
// @connect 10.6.73.45
// @connect 10.6.73.40
// @connect 10.6.73.51
// @connect 10.6.72.24
// @connect 10.6.73.46
// @connect 10.6.73.43
// @connect 10.6.73.54
// @connect 10.6.73.56
// @connect 10.6.73.53
// @connect 10.6.73.57
// @connect 10.6.73.55
// @connect 10.6.73.58
// @connect 10.6.68.149
// @connect 10.6.73.59
// @connect 10.6.42.95
// @connect 10.6.40.2
// @connect 10.6.40.68
// @connect 10.6.40.73
// @connect 10.6.41.4
// @connect 10.6.42.209
// @connect 10.6.43.87
// @connect 10.6.41.16
// @connect 10.6.42.12
// @connect 10.6.42.142
// @connect 10.6.42.78
// @connect 10.6.42.80
// @connect 10.6.42.199
// @connect 10.6.43.69
// @connect 10.6.42.161
// @connect 10.6.43.33
// @connect 10.6.40.86
// @connect 10.6.43.83
// @connect 10.6.42.90
// @connect 10.6.42.163
// @connect 10.6.43.81
// @connect 10.6.42.9
// @connect 10.6.43.36
// @connect 10.6.42.210
// @connect 10.6.41.232
// @connect 10.6.43.98
// @connect 10.6.42.158
// @connect 10.6.43.14
// @connect 10.6.42.35
// @connect 10.6.40.95
// @connect 10.6.42.83
// @connect 10.6.42.96
// @connect 10.6.42.4
// @connect 10.6.42.132
// @connect 10.6.42.197
// @connect 10.6.40.72
// @connect 10.6.40.90
// @connect 10.6.54.158
// @connect 10.6.42.151
// @connect 10.6.43.32
// @connect 10.6.43.23
// @connect 10.6.43.9
// @connect 10.6.43.90
// @connect 10.6.40.206
// @connect 10.6.42.221
// @connect 10.6.43.72
// @connect 10.6.54.157
// @connect 10.6.42.195
// @connect 10.6.41.3
// @connect 10.6.43.99
// @connect 10.6.26.234
// @connect 10.6.43.96
// @connect 10.6.42.144
// @connect 10.6.43.40
// @connect 10.6.61.169
// @connect 10.6.42.77
// @connect 10.6.42.146
// @connect 10.6.42.104
// @connect 10.6.43.17
// @connect 10.6.42.160
// @connect 10.6.41.15
// @connect 10.6.42.143
// @connect 10.6.42.137
// @connect 10.6.43.38
// @connect 10.6.43.2
// @connect 10.6.27.75
// @connect 10.6.40.80
// @connect 10.6.46.233
// @connect 10.6.43.84
// @connect 10.6.42.218
// @connect 10.6.43.89
// @connect 10.6.43.27
// @connect 10.6.26.22
// @connect 10.6.42.203
// @connect 10.6.40.71
// @connect 10.6.42.205
// @connect 10.6.43.35
// @connect 10.6.42.23
// @connect 10.6.41.233
// @connect 10.6.43.3
// @connect 10.6.42.200
// @connect 10.6.41.217
// @connect 10.6.61.167
// @connect 10.6.43.4
// @connect 10.6.41.35
// @connect 10.6.42.145
// @connect 10.6.13.102
// @connect 10.6.42.138
// @connect 10.6.40.75
// @connect 10.6.42.217
// @connect 10.6.41.9
// @connect 10.6.42.91
// @connect 10.6.43.92
// @connect 10.6.42.93
// @connect 10.6.42.75
// @connect 10.6.41.7
// @connect 10.6.43.30
// @connect 10.6.54.207
// @connect 10.6.42.149
// @connect 10.6.42.141
// @connect 10.6.17.104
// @connect 10.6.43.76
// @connect 10.6.42.88
// @connect 10.6.54.154
// @connect 10.6.43.93
// @connect 10.6.41.13
// @connect 10.6.43.101
// @connect 10.6.42.89
// @connect 10.6.40.66
// @connect 10.6.63.92
// @connect 10.6.42.130
// @connect 10.6.41.78
// @connect 10.6.42.229
// @connect 10.6.19.21
// @connect 10.6.42.206
// @connect 10.6.42.201
// @connect 10.6.41.10
// @connect 10.6.42.225
// @connect 10.6.43.100
// @connect 10.6.42.168
// @connect 10.6.17.39
// @connect 10.6.43.6
// @connect 10.6.43.85
// @connect 10.6.41.8
// @connect 10.6.42.22
// @connect 10.6.42.198
// @connect 10.6.42.159
// @connect 10.6.43.88
// @connect 10.6.42.94
// @connect 10.6.41.229
// @connect 10.6.42.85
// @connect 10.6.43.28
// @connect 10.6.43.86
// @connect 10.6.43.91
// @connect 10.6.42.211
// @connect 10.6.61.77
// @connect 10.6.42.92
// @connect 10.6.42.131
// @connect 10.6.42.100
// @connect 10.6.41.2
// @connect 10.6.42.11
// @connect 10.6.43.25
// @connect 10.6.42.135
// @connect 10.6.42.102
// @connect 10.6.4.5
// @connect 10.6.42.99
// @connect 10.6.40.231
// @connect 10.6.43.68
// @connect 10.6.42.140
// @connect 10.6.42.86
// @connect 10.6.42.223
// @connect 10.6.42.208
// @connect 10.6.42.21
// @connect 10.6.43.80
// @connect 10.6.16.106
// @connect 10.6.55.98
// @connect 10.6.42.69
// @connect 10.6.16.229
// @connect 10.6.43.97
// @connect 10.6.42.153
// @connect 10.6.42.169
// @connect 10.6.42.84
// @connect 10.6.43.34
// @connect 10.6.54.212
// @connect 10.6.42.97
// @connect 10.6.43.24
// @connect 10.6.43.82
// @connect 10.6.42.165
// @connect 10.6.43.18
// @connect 10.6.16.230
// @connect 10.6.42.216
// @connect 10.6.17.23
// @connect 10.6.41.83
// @connect 10.6.42.68
// @connect 10.6.42.3
// @connect 10.6.42.15
// @connect 10.6.42.66
// @connect 10.6.42.81
// @connect 10.6.43.15
// @connect 10.6.43.75
// @connect 10.6.41.89
// @connect 10.6.42.150
// @connect 10.6.22.222
// @connect 10.6.42.10
// @connect 10.6.42.133
// @connect 10.6.18.14
// @connect 10.6.42.134
// @connect 10.6.43.16
// @connect 10.6.42.147
// @connect 10.6.54.155
// @connect 10.6.42.19
// @connect 10.6.52.33
// @connect 10.6.41.82
// @connect 10.6.43.12
// @connect 10.6.42.222
// @connect 10.6.42.212
// @connect 10.6.42.38
// @connect 10.6.22.216
// @connect 10.6.42.207
// @connect 10.6.42.20
// @connect 10.6.42.202
// @connect 10.6.40.93
// @connect 10.6.43.29
// @connect 10.6.55.105
// @connect 10.6.42.39
// @connect 10.6.42.73
// @connect 10.6.42.14
// @connect 10.6.42.157
// @connect 10.6.42.5
// @connect 10.6.41.11
// @connect 10.6.43.20
// @connect 10.6.54.156
// @connect 10.6.42.213
// @connect 10.6.43.31
// @connect 10.6.42.37
// @connect 10.6.42.25
// @connect 10.6.42.139
// @connect 10.6.41.12
// @connect 10.6.42.32
// @connect 10.6.55.20
// @connect 10.6.41.14
// @connect 10.6.42.98
// @connect 10.6.22.66
// @connect 10.6.43.5
// @connect 10.6.43.70
// @connect 10.6.42.214
// @connect 10.6.42.162
// @connect 10.6.43.13
// @connect 10.6.42.101
// @connect 10.6.40.140
// @connect 10.6.17.73
// @connect 10.6.40.145
// @connect 10.6.40.81
// @connect 10.6.54.227
// @connect 10.6.43.67
// @connect 10.6.42.67
// @connect 10.6.40.79
// @connect 10.6.43.10
// @connect 10.6.41.36
// @connect 10.6.43.7
// @connect 10.6.54.226
// @connect 10.6.42.13
// @connect 10.6.54.228
// @connect 10.6.43.74
// @connect 10.6.55.75
// @connect 10.6.42.156
// @connect 10.6.42.7
// @connect 10.6.54.213
// @connect 10.6.42.16
// @connect 10.6.41.27
// @connect 10.6.18.234
// @connect 10.6.40.100
// @connect 10.6.42.155
// @connect 10.6.54.200
// @connect 10.6.43.11
// @connect 10.6.41.80
// @connect 10.6.42.17
// @connect 10.6.54.208
// @connect 10.6.40.97
// @connect 10.6.42.204
// @connect 10.6.55.21
// @connect 10.6.41.230
// @connect 10.6.40.24
// @connect 10.6.43.77
// @connect 10.6.42.136
// @connect 10.6.40.218
// @connect 10.6.55.85
// @connect 10.6.42.154
// @connect 10.6.43.8
// @connect 10.6.42.194
// @connect 10.6.55.96
// @connect 10.6.21.164
// @connect 10.6.54.211
// @connect 10.6.42.8
// @connect 10.6.42.148
// @connect 10.6.41.31
// @connect 10.6.17.195
// @connect 10.6.55.102
// @connect 10.6.54.199
// @connect 10.6.54.203
// @connect 10.6.41.38
// @connect 10.6.40.105
// @connect 10.6.42.70
// @connect 10.6.43.73
// @connect 10.6.40.132
// @connect 10.6.55.27
// @connect 10.6.41.5
// @connect 10.6.43.21
// @connect 10.6.42.76
// @connect 10.6.40.224
// @connect 10.6.21.9
// @connect 10.6.16.209
// @connect 10.6.42.29
// @connect 10.6.40.196
// @connect 10.6.42.34
// @connect 10.6.41.102
// @connect 10.6.34.66
// @connect 10.6.54.209
// @connect 10.6.43.79
// @connect 10.6.43.26
// @connect 10.6.55.30
// @connect 10.6.54.206
// @connect 10.6.62.222
// @connect 10.6.20.233
// @connect 10.6.41.197
// @connect 10.6.28.102
// @connect 10.6.19.34
// @connect 10.6.40.146
// @connect 10.6.41.93
// @connect 10.6.55.72
// @connect 10.6.54.82
// @connect 10.6.41.37
// @connect 10.6.40.3
// @connect 10.6.43.102
// @connect 10.6.40.85
// @connect 10.6.54.89
// @connect 10.6.40.74
// @connect 10.6.43.104
// @connect 10.6.29.217
// @connect 10.6.43.94
// @connect 10.6.54.194
// @connect 10.6.41.94
// @connect 10.6.40.169
// @connect 10.6.29.230
// @connect 10.6.42.28
// @connect 10.6.54.77
// @connect 10.6.55.97
// @connect 10.6.54.80
// @connect 10.6.40.98
// @connect 10.6.40.209
// @connect 10.6.40.38
// @connect 10.6.41.84
// @connect 10.6.40.84
// @connect 10.6.40.36
// @connect 10.6.40.28
// @connect 10.6.27.37
// @connect 10.6.54.78
// @connect 10.6.25.154
// @connect 10.6.55.24
// @connect 10.6.2.23
// @connect 10.6.5.10
// @connect 10.6.40.6
// @connect 10.6.40.213
// @connect 10.6.42.215
// @connect 10.6.41.75
// @connect 10.6.40.94
// @connect 10.6.55.18
// @connect 10.6.54.159
// @connect 10.6.55.77
// @connect 10.6.27.78
// @connect 10.6.42.26
// @connect 10.6.40.151
// @connect 10.6.55.23
// @connect 10.6.41.29
// @connect 10.6.55.101
// @connect 10.6.17.142
// @connect 10.6.55.99
// @connect 10.6.40.161
// @connect 10.6.41.92
// @connect 10.6.24.167
// @connect 10.6.40.221
// @connect 10.6.41.101
// @connect 10.6.54.67
// @connect 10.6.55.9
// @connect 10.6.54.196
// @connect 10.6.8.232
// @connect 10.6.55.76
// @connect 10.6.40.101
// @connect 10.6.28.231
// @connect 10.6.40.168
// @connect 10.6.41.99
// @connect 10.6.40.156
// @connect 10.6.40.99
// @connect 10.6.18.27
// @connect 10.6.41.81
// @connect 10.6.40.163
// @connect 10.6.54.195
// @connect 10.6.26.106
// @connect 10.6.40.142
// @connect 10.6.55.16
// @connect 10.6.40.204
// @connect 10.6.41.196
// @connect 10.6.41.142
// @connect 10.6.54.216
// @connect 10.6.54.222
// @connect 10.6.40.148
// @connect 10.6.54.70
// @connect 10.6.11.103
// @connect 10.6.54.66
// @connect 10.6.5.15
// @connect 10.6.11.86
// @connect 10.6.41.96
// @connect 10.6.55.81
// @connect 10.6.55.8
// @connect 10.6.28.232
// @connect 10.6.40.228
// @connect 10.6.55.11
// @connect 10.6.40.199
// @connect 10.6.62.158
// @connect 10.6.55.12
// @connect 10.6.41.24
// @connect 10.6.41.41
// @connect 10.6.40.227
// @connect 10.6.55.25
// @connect 10.6.2.145
// @connect 10.6.40.211
// @connect 10.6.40.201
// @connect 10.6.42.24
// @connect 10.6.54.219
// @connect 10.6.2.68
// @connect 10.6.41.76
// @connect 10.6.54.214
// @connect 10.6.40.12
// @connect 10.6.40.26
// @connect 10.6.4.153
// @connect 10.6.30.9
// @connect 10.6.13.135
// @connect 10.6.40.69
// @connect 10.6.40.27
// @connect 10.6.41.77
// @connect 10.6.40.225
// @connect 10.6.55.13
// @connect 10.6.40.210
// @connect 10.6.41.25
// @connect 10.6.54.210
// @connect 10.6.41.216
// @connect 10.6.41.88
// @connect 10.6.40.82
// @connect 10.6.40.157
// @connect 10.6.10.33
// @connect 10.6.55.83
// @connect 10.6.55.29
// @connect 10.6.40.30
// @connect 10.6.40.37
// @connect 10.6.55.70
// @connect 10.6.41.39
// @connect 10.6.53.23
// @connect 10.6.26.161
// @connect 10.6.54.72
// @connect 10.6.54.229
// @connect 10.6.54.73
// @connect 10.6.40.215
// @connect 10.6.41.32
// @connect 10.6.55.103
// @connect 10.6.9.14
// @connect 10.6.42.196
// @connect 10.6.54.88
// @connect 10.6.41.100
// @connect 10.6.25.136
// @connect 10.6.41.34
// @connect 10.6.55.92
// @connect 10.6.41.87
// @connect 10.6.54.83
// @connect 10.6.42.41
// @connect 10.6.54.220
// @connect 10.6.6.24
// @connect 10.6.40.32
// @connect 10.6.54.79
// @connect 10.6.40.159
// @connect 10.6.40.217
// @connect 10.6.29.158
// @connect 10.6.54.75
// @connect 10.6.54.69
// @connect 10.6.43.66
// @connect 10.6.40.222
// @connect 10.6.40.96
// @connect 10.6.40.16
// @connect 10.6.41.224
// @connect 10.6.55.104
// @connect 10.6.40.138
// @connect 10.6.40.197
// @connect 10.6.41.67
// @connect 10.6.54.221
// @connect 10.6.40.78
// @connect 10.6.40.29
// @connect 10.6.43.22
// @connect 10.6.42.72
// @connect 10.6.55.90
// @connect 10.6.20.141
// @connect 10.6.40.137
// @connect 10.6.40.31
// @connect 10.6.54.215
// @connect 10.6.13.5
// @connect 10.6.40.8
// @connect 10.6.26.99
// @connect 10.6.40.70
// @connect 10.6.41.21
// @connect 10.6.40.144
// @connect 10.6.41.68
// @connect 10.6.41.97
// @connect 10.6.54.205
// @connect 10.6.55.69
// @connect 10.6.40.87
// @connect 10.6.40.229
// @connect 10.6.25.214
// @connect 10.6.40.17
// @connect 10.6.40.207
// @connect 10.6.54.71
// @connect 10.6.55.6
// @connect 10.6.41.19
// @connect 10.6.40.216
// @connect 10.6.41.91
// @connect 10.6.40.130
// @connect 10.6.40.77
// @connect 10.6.40.166
// @connect 10.6.54.90
// @connect 10.6.55.89
// @connect 10.6.54.223
// @connect 10.6.41.98
// @connect 10.6.40.134
// @connect 10.6.12.228
// @connect 10.6.55.19
// @connect 10.6.64.6
// @connect 10.6.40.226
// @connect 10.6.40.147
// @connect 10.6.40.219
// @connect 10.6.31.102
// @connect 10.6.40.214
// @connect 10.6.23.11
// @connect 10.6.40.34
// @connect 10.6.43.95
// @connect 10.6.55.93
// @connect 10.6.40.88
// @connect 10.6.40.89
// @connect 10.6.41.85
// @connect 10.6.54.204
// @connect 10.6.43.19
// @connect 10.6.25.168
// @connect 10.6.23.3
// @connect 10.6.55.91
// @connect 10.6.55.15
// @connect 10.6.41.26
// @connect 10.6.40.33
// @connect 10.6.42.87
// @connect 10.6.55.86
// @connect 10.6.41.69
// @connect 10.6.12.87
// @connect 10.6.40.40
// @connect 10.6.40.11
// @connect 10.6.54.91
// @connect 10.6.41.17
// @connect 10.6.41.234
// @connect 10.6.40.41
// @connect 10.6.30.90
// @connect 10.6.41.70
// @connect 10.6.55.67
// @connect 10.6.41.95
// @connect 10.6.40.67
// @connect 10.6.40.139
// @connect 10.6.40.22
// @connect 10.6.55.71
// @connect 10.6.40.7
// @connect 10.6.41.90
// @connect 10.6.41.23
// @connect 10.6.40.205
// @connect 10.6.40.131
// @connect 10.6.31.39
// @connect 10.6.54.198
// @connect 10.6.65.58
// @connect 10.6.23.73
// @connect 10.6.44.232
// @connect 10.6.40.154
// @connect 10.6.54.84
// @connect 10.6.40.143
// @connect 10.6.40.200
// @connect 10.6.41.20
// @connect 10.6.40.10
// @connect 10.6.40.203
// @connect 10.6.40.18
// @connect 10.6.54.197
// @connect 10.6.40.162
// @connect 10.6.41.86
// @connect 10.6.40.150
// @connect 10.6.55.4
// @connect 10.6.55.5
// @connect 10.6.20.5
// @connect 10.6.41.22
// @connect 10.6.41.73
// @connect 10.6.40.135
// @connect 10.6.40.14
// @connect 10.6.41.79
// @connect 10.6.42.31
// @connect 10.6.14.223
// @connect 10.6.54.225
// @connect 10.6.55.80
// @connect 10.6.15.94
// @connect 10.6.40.5
// @connect 10.6.40.23
// @connect 10.6.54.218
// @connect 10.6.40.4
// @connect 10.6.55.88
// @connect 10.6.43.105
// @connect 10.6.55.84
// @connect 10.6.40.35
// @connect 10.6.5.209
// @connect 10.6.54.86
// @connect 10.6.40.160
// @connect 10.6.41.33
// @connect 10.6.55.94
// @connect 10.6.55.2
// @connect 10.6.34.80
// @connect 10.6.55.68
// @connect 10.6.40.149
// @connect 10.6.41.66
// @connect 10.6.40.208
// @connect 10.6.42.167
// @connect 10.6.40.155
// @connect 10.6.40.220
// @connect 10.6.41.223
// @connect 10.6.45.164
// @connect 10.6.41.18
// @connect 10.6.55.78
// @connect 10.6.40.167
// @connect 10.6.55.28
// @connect 10.6.41.40
// @connect 10.6.40.212
// @connect 10.6.55.82
// @connect 10.6.0.90
// @connect 10.6.54.74
// @connect 10.6.40.164
// @connect 10.6.54.224
// @connect 10.6.41.103
// @connect 10.6.25.138
// @connect 10.6.13.205
// @connect 10.6.54.85
// @connect 10.6.42.71
// @connect 10.6.40.195
// @connect 10.6.55.7
// @connect 10.6.41.30
// @connect 10.6.40.198
// @connect 10.6.54.87
// @connect 10.6.40.153
// @connect 10.6.11.105
// @connect 10.6.41.104
// @connect 10.6.41.72
// @connect 10.6.55.22
// @connect 10.6.54.201
// @connect 10.6.40.133
// @connect 10.6.40.76
// @connect 10.6.53.159
// @connect 10.6.40.20
// @connect 10.6.41.105
// @connect 10.6.54.202
// @connect 10.6.42.233
// @connect 10.6.40.103
// @connect 10.6.15.5
// @connect 10.6.55.87
// @connect 10.6.55.66
// @connect 10.6.40.165
// @connect 10.6.41.28
// @connect 10.6.54.217
// @connect 10.6.40.15
// @connect 10.6.40.83
// @connect 10.6.40.39
// @connect 10.6.52.137
// @connect 10.6.12.168
// @connect 10.6.55.3
// @connect 10.6.41.71
// @connect 10.6.40.194
// @connect 10.6.42.105
// @connect 10.6.40.202
// @connect 10.6.40.19
// @connect 10.6.55.100
// @connect 10.6.40.104
// @connect 10.6.42.79
// @connect 10.6.27.29
// @connect 10.6.40.25
// @connect 10.6.55.79
// @connect 10.6.40.21
// @connect 10.6.55.74
// @connect 10.6.40.141
// @connect 10.6.23.42
// @connect 10.6.40.13
// @connect 10.6.40.158
// @connect 10.6.54.76
// @connect 10.6.55.73
// @connect 10.6.54.81
// @connect 10.6.40.136
// @connect 10.6.40.9
// @connect 10.6.54.68
// @connect 10.6.42.74
// @connect 10.6.73.62
// @connect 10.6.73.61
// @connect 10.6.73.63
// @connect 10.6.73.66
// @connect 10.6.73.65
// @connect 10.6.73.71
// @connect 10.6.73.64
// @connect 10.6.73.70
// @connect 10.6.73.68
// @connect 10.6.73.67
// @connect 10.6.73.69
// @connect 10.6.73.75
// @connect 10.6.73.72
// @connect 10.6.73.80
// @connect 10.6.73.74
// @connect 10.6.73.79
// @connect 10.6.74.44
// @connect 10.6.73.77
// @connect 10.6.73.73
// @connect 10.6.73.78
// @connect 10.6.73.84
// @connect 10.6.73.85
// @connect 10.6.73.82
// @connect 10.6.73.89
// @connect 10.6.73.90
// @connect 10.6.72.56
// @connect 10.6.73.83
// @connect 10.6.73.87
// @connect 10.6.73.86
// @connect 10.6.73.97
// @connect 10.6.73.93
// @connect 10.6.73.92
// @connect 10.6.73.95
// @connect 10.6.73.91
// @connect 10.6.73.96
// @connect 10.6.73.94
// @connect 10.6.68.150
// @connect 10.6.73.98
// @connect 10.6.73.104
// @connect 10.6.73.105
// @connect 10.6.73.102
// @connect 10.6.73.99
// @connect 10.6.73.103
// @connect 10.6.73.100
// @connect 10.6.73.109
// @connect 10.6.73.106
// @connect 10.6.73.110
// @connect 10.6.72.78
// @connect 10.6.73.107
// @connect 10.6.73.113
// @connect 10.6.73.115
// @connect 10.6.73.117
// @connect 10.6.73.114
// @connect 10.6.73.111
// @connect 10.6.73.116
// @connect 10.6.73.112
// @connect 10.6.73.118
// @connect 10.6.73.121
// @connect 10.6.73.119
// @connect 10.6.73.122
// @connect 10.6.73.120
// @connect 10.6.73.123
// @connect 10.6.73.124
// @connect 10.6.73.125
// @connect 10.6.73.126
// @connect 10.6.73.129
// @connect 10.6.73.131
// @connect 10.6.73.128
// @connect 10.6.73.130
// @connect 10.6.73.127
// @connect 10.6.73.137
// @connect 10.6.73.135
// @connect 10.6.73.138
// @connect 10.6.73.133
// @connect 10.6.73.139
// @connect 10.6.73.132
// @connect 10.6.73.136
// @connect 10.6.73.134
// @connect 10.6.73.140
// @connect 10.6.73.143
// @connect 10.6.73.141
// @connect 10.6.73.142
// @connect 10.6.73.145
// @connect 10.6.73.152
// @connect 10.6.73.153
// @connect 10.6.73.149
// @connect 10.6.73.151
// @connect 10.6.73.150
// @connect 10.6.73.146
// @connect 10.6.73.144
// @connect 10.6.72.63
// @connect 10.6.73.88
// @connect 10.6.73.154
// @connect 10.6.73.155
// @connect 10.6.73.160
// @connect 10.6.73.163
// @connect 10.6.73.158
// @connect 10.6.73.162
// @connect 10.6.73.164
// @connect 10.6.73.157
// @connect 10.6.73.161
// @connect 10.6.73.159
// @connect 10.6.73.156
// @connect 10.6.73.169
// @connect 10.6.73.165
// @connect 10.6.73.170
// @connect 10.6.73.167
// @connect 10.6.73.148
// @connect 10.6.73.166
// @connect 10.6.73.172
// @connect 10.6.73.177
// @connect 10.6.73.175
// @connect 10.6.73.176
// @connect 10.6.73.173
// @connect 10.6.73.174
// @connect 10.6.73.171
// @connect 10.6.73.180
// @connect 10.6.73.179
// @connect 10.6.73.254
// @connect 10.6.73.182
// @connect 10.6.73.181
// @connect 10.6.73.190
// @connect 10.6.73.184
// @connect 10.6.73.183
// @connect 10.6.73.188
// @connect 10.6.73.191
// @connect 10.6.73.186
// @connect 10.6.73.185
// @connect 10.6.73.189
// @connect 10.6.73.187
// @connect 10.6.73.196
// @connect 10.6.73.194
// @connect 10.6.73.198
// @connect 10.6.73.197
// @connect 10.6.73.201
// @connect 10.6.73.195
// @connect 10.6.73.199
// @connect 10.6.73.193
// @connect 10.6.73.34
// @connect 10.6.73.200
// @connect 10.6.73.204
// @connect 10.6.72.247
// @connect 10.6.73.203
// @connect 10.6.73.205
// @connect 10.6.73.208
// @connect 10.6.73.206
// @connect 10.6.73.207
// @connect 10.6.73.209
// @connect 10.6.73.168
// @connect 10.6.73.217
// @connect 10.6.73.212
// @connect 10.6.73.215
// @connect 10.6.73.216
// @connect 10.6.73.214
// @connect 10.6.73.210
// @connect 10.6.73.211
// @connect 10.6.73.218
// @connect 10.6.73.220
// @connect 10.6.73.223
// @connect 10.6.73.224
// @connect 10.6.73.222
// @connect 10.6.73.225
// @connect 10.6.73.221
// @connect 10.6.73.235
// @connect 10.6.73.226
// @connect 10.6.73.233
// @connect 10.6.73.232
// @connect 10.6.73.234
// @connect 10.6.73.236
// @connect 10.6.73.230
// @connect 10.6.73.229
// @connect 10.6.73.228
// @connect 10.6.73.231
// @connect 10.6.73.227
// @connect 10.6.73.238
// @connect 10.6.73.241
// @connect 10.6.73.239
// @connect 10.6.73.240
// @connect 10.6.73.237
// @connect 10.6.73.242
// @connect 10.6.73.244
// @connect 10.6.73.243
// @connect 10.6.73.245
// @connect 10.6.73.248
// @connect 10.6.73.247
// @connect 10.6.73.246
// @connect 10.6.73.249
// @connect 10.6.73.251
// @connect 10.6.73.250
// @connect 10.6.73.253
// @connect 10.6.73.252
// @connect 10.6.68.2
// @connect 10.6.74.3
// @connect 10.6.74.1
// @connect 10.6.74.0
// @connect 10.6.69.46
// @connect 10.6.74.6
// @connect 10.6.74.4
// @connect 10.6.74.5
// @connect 10.6.73.178
// @connect 10.6.74.11
// @connect 10.6.74.10
// @connect 10.6.74.14
// @connect 10.6.74.12
// @connect 10.6.74.18
// @connect 10.6.74.13
// @connect 10.6.74.9
// @connect 10.6.74.19
// @connect 10.6.74.16
// @connect 10.6.74.15
// @connect 10.6.74.17
// @connect 10.6.74.27
// @connect 10.6.74.26
// @connect 10.6.74.34
// @connect 10.6.74.30
// @connect 10.6.74.24
// @connect 10.6.74.37
// @connect 10.6.74.29
// @connect 10.6.74.23
// @connect 10.6.74.25
// @connect 10.6.74.22
// @connect 10.6.74.21
// @connect 10.6.74.38
// @connect 10.6.74.35
// @connect 10.6.74.31
// @connect 10.6.74.28
// @connect 10.6.74.39
// @connect 10.6.74.33
// @connect 10.6.74.36
// @connect 10.6.74.40
// @connect 10.6.74.32
// @connect 10.6.74.20
// @connect 10.6.74.42
// @connect 10.6.64.20
// @connect 10.6.64.22
// @connect 10.6.64.12
// @connect 10.6.64.9
// @connect 10.6.64.3
// @connect 10.6.64.11
// @connect 10.6.64.27
// @connect 10.6.64.41
// @connect 10.6.64.18
// @connect 10.6.64.32
// @connect 10.6.64.35
// @connect 10.6.64.29
// @connect 10.6.64.7
// @connect 10.6.64.15
// @connect 10.6.64.30
// @connect 10.6.64.31
// @connect 10.6.41.152
// @connect 10.6.64.16
// @connect 10.6.64.38
// @connect 10.6.64.19
// @connect 10.6.64.10
// @connect 10.6.64.13
// @connect 10.6.64.40
// @connect 10.6.64.8
// @connect 10.6.64.23
// @connect 10.6.64.14
// @connect 10.6.64.39
// @connect 10.6.64.4
// @connect 10.6.64.21
// @connect 10.6.64.26
// @connect 10.6.64.34
// @connect 10.6.64.36
// @connect 10.6.64.2
// @connect 10.6.64.33
// @connect 10.6.64.25
// @connect 10.6.64.5
// @connect 10.6.64.37
// @connect 10.6.64.17
// @connect 10.6.64.24
// @connect 10.6.64.47
// @connect 10.6.64.73
// @connect 10.6.64.63
// @connect 10.6.64.67
// @connect 10.6.64.71
// @connect 10.6.64.65
// @connect 10.6.64.57
// @connect 10.6.64.49
// @connect 10.6.64.55
// @connect 10.6.64.51
// @connect 10.6.64.45
// @connect 10.6.64.87
// @connect 10.6.64.69
// @connect 10.6.64.50
// @connect 10.6.64.81
// @connect 10.6.64.68
// @connect 10.6.64.116
// @connect 10.6.64.72
// @connect 10.6.64.97
// @connect 10.6.64.77
// @connect 10.6.64.74
// @connect 10.6.64.60
// @connect 10.6.64.79
// @connect 10.6.64.56
// @connect 10.6.64.62
// @connect 10.6.64.46
// @connect 10.6.64.54
// @connect 10.6.64.48
// @connect 10.6.64.52
// @connect 10.6.64.61
// @connect 10.6.64.58
// @connect 10.6.64.66
// @connect 10.6.64.75
// @connect 10.6.64.42
// @connect 10.6.64.76
// @connect 10.6.64.44
// @connect 10.6.64.85
// @connect 10.6.64.110
// @connect 10.6.64.90
// @connect 10.6.64.107
// @connect 10.6.64.84
// @connect 10.6.64.53
// @connect 10.6.64.104
// @connect 10.6.64.127
// @connect 10.6.64.120
// @connect 10.6.64.118
// @connect 10.6.64.108
// @connect 10.6.64.92
// @connect 10.6.64.88
// @connect 10.6.64.86
// @connect 10.6.64.128
// @connect 10.6.64.126
// @connect 10.6.64.91
// @connect 10.6.64.113
// @connect 10.6.64.175
// @connect 10.6.64.171
// @connect 10.6.64.185
// @connect 10.6.64.139
// @connect 10.6.64.121
// @connect 10.6.64.132
// @connect 10.6.64.157
// @connect 10.6.64.199
// @connect 10.6.64.191
// @connect 10.6.64.109
// @connect 10.6.64.181
// @connect 10.6.64.95
// @connect 10.6.64.105
// @connect 10.6.64.144
// @connect 10.6.64.123
// @connect 10.6.64.161
// @connect 10.6.64.99
// @connect 10.6.64.137
// @connect 10.6.64.188
// @connect 10.6.64.94
// @connect 10.6.64.130
// @connect 10.6.64.164
// @connect 10.6.64.165
// @connect 10.6.64.169
// @connect 10.6.64.183
// @connect 10.6.64.186
// @connect 10.6.64.119
// @connect 10.6.64.198
// @connect 10.6.64.196
// @connect 10.6.64.176
// @connect 10.6.64.101
// @connect 10.6.64.192
// @connect 10.6.64.135
// @connect 10.6.64.106
// @connect 10.6.64.173
// @connect 10.6.64.194
// @connect 10.6.64.134
// @connect 10.6.64.111
// @connect 10.6.64.189
// @connect 10.6.64.160
// @connect 10.6.64.148
// @connect 10.6.64.143
// @connect 10.6.64.82
// @connect 10.6.64.163
// @connect 10.6.64.138
// @connect 10.6.64.153
// @connect 10.6.64.146
// @connect 10.6.64.141
// @connect 10.6.64.117
// @connect 10.6.64.89
// @connect 10.6.64.124
// @connect 10.6.64.142
// @connect 10.6.64.170
// @connect 10.6.64.96
// @connect 10.6.64.133
// @connect 10.6.64.154
// @connect 10.6.64.112
// @connect 10.6.64.156
// @connect 10.6.64.125
// @connect 10.6.64.177
// @connect 10.6.64.195
// @connect 10.6.64.158
// @connect 10.6.64.103
// @connect 10.6.64.150
// @connect 10.6.64.102
// @connect 10.6.64.178
// @connect 10.6.64.190
// @connect 10.6.64.122
// @connect 10.6.64.166
// @connect 10.6.64.172
// @connect 10.6.64.115
// @connect 10.6.64.162
// @connect 10.6.64.140
// @connect 10.6.64.167
// @connect 10.6.64.187
// @connect 10.6.64.129
// @connect 10.6.64.83
// @connect 10.6.64.147
// @connect 10.6.64.182
// @connect 10.6.64.184
// @connect 10.6.64.168
// @connect 10.6.64.152
// @connect 10.6.64.149
// @connect 10.6.64.197
// @connect 10.6.64.193
// @connect 10.6.64.98
// @connect 10.6.64.136
// @connect 10.6.64.174
// @connect 10.6.64.131
// @connect 10.6.64.100
// @connect 10.6.64.179
// @connect 10.6.64.180
// @connect 10.6.64.151
// @connect 10.6.64.93
// @connect 10.6.64.159
// @connect 10.6.64.200
// @connect 10.6.64.145
// @connect 10.6.65.39
// @connect 10.6.65.100
// @connect 10.6.65.32
// @connect 10.6.64.225
// @connect 10.6.64.247
// @connect 10.6.64.231
// @connect 10.6.65.97
// @connect 10.6.64.209
// @connect 10.6.65.12
// @connect 10.6.65.83
// @connect 10.6.64.220
// @connect 10.6.65.37
// @connect 10.6.65.17
// @connect 10.6.65.7
// @connect 10.6.64.221
// @connect 10.6.65.101
// @connect 10.6.64.219
// @connect 10.6.65.16
// @connect 10.6.65.14
// @connect 10.6.65.94
// @connect 10.6.64.248
// @connect 10.6.65.6
// @connect 10.6.64.206
// @connect 10.6.65.43
// @connect 10.6.64.213
// @connect 10.6.64.252
// @connect 10.6.64.233
// @connect 10.6.65.22
// @connect 10.6.64.234
// @connect 10.6.65.55
// @connect 10.6.64.201
// @connect 10.6.65.24
// @connect 10.6.65.61
// @connect 10.6.65.18
// @connect 10.6.64.224
// @connect 10.6.65.31
// @connect 10.6.65.95
// @connect 10.6.65.8
// @connect 10.6.64.230
// @connect 10.6.65.82
// @connect 10.6.64.237
// @connect 10.6.64.211
// @connect 10.6.64.212
// @connect 10.6.64.227
// @connect 10.6.65.28
// @connect 10.6.30.214
// @connect 10.6.64.243
// @connect 10.6.64.232
// @connect 10.6.65.85
// @connect 10.6.64.202
// @connect 10.6.65.86
// @connect 10.6.64.210
// @connect 10.6.65.87
// @connect 10.6.64.216
// @connect 10.6.64.254
// @connect 10.6.65.9
// @connect 10.6.65.47
// @connect 10.6.65.36
// @connect 10.6.64.223
// @connect 10.6.64.205
// @connect 10.6.65.48
// @connect 10.6.65.96
// @connect 10.6.64.226
// @connect 10.6.65.98
// @connect 10.6.65.42
// @connect 10.6.65.33
// @connect 10.6.64.240
// @connect 10.6.65.34
// @connect 10.6.65.30
// @connect 10.6.65.56
// @connect 10.6.65.19
// @connect 10.6.65.11
// @connect 10.6.64.251
// @connect 10.6.65.38
// @connect 10.6.65.64
// @connect 10.6.64.204
// @connect 10.6.65.4
// @connect 10.6.64.203
// @connect 10.6.64.207
// @connect 10.6.64.214
// @connect 10.6.64.242
// @connect 10.6.64.218
// @connect 10.6.65.91
// @connect 10.6.65.10
// @connect 10.6.65.92
// @connect 10.6.64.239
// @connect 10.6.65.29
// @connect 10.6.65.51
// @connect 10.6.64.241
// @connect 10.6.65.194
// @connect 10.6.64.246
// @connect 10.6.64.250
// @connect 10.6.64.244
// @connect 10.6.64.238
// @connect 10.6.65.93
// @connect 10.6.65.126
// @connect 10.6.65.13
// @connect 10.6.65.44
// @connect 10.6.65.40
// @connect 10.6.65.45
// @connect 10.6.64.235
// @connect 10.6.65.49
// @connect 10.6.64.249
// @connect 10.6.64.229
// @connect 10.6.65.35
// @connect 10.6.65.90
// @connect 10.6.64.208
// @connect 10.6.65.46
// @connect 10.6.65.53
// @connect 10.6.64.253
// @connect 10.6.65.41
// @connect 10.6.65.50
// @connect 10.6.64.236
// @connect 10.6.65.23
// @connect 10.6.64.215
// @connect 10.6.65.1
// @connect 10.6.65.57
// @connect 10.6.65.54
// @connect 10.6.65.60
// @connect 10.6.65.15
// @connect 10.6.65.88
// @connect 10.6.65.84
// @connect 10.6.64.222
// @connect 10.6.65.26
// @connect 10.6.65.52
// @connect 10.6.65.99
// @connect 10.6.65.0
// @connect 10.6.64.217
// @connect 10.6.65.21
// @connect 10.6.65.5
// @connect 10.6.65.73
// @connect 10.6.65.70
// @connect 10.6.65.72
// @connect 10.6.65.68
// @connect 10.6.65.71
// @connect 10.6.65.219
// @connect 10.6.65.74
// @connect 10.6.65.66
// @connect 10.6.65.79
// @connect 10.6.65.77
// @connect 10.6.65.63
// @connect 10.6.65.75
// @connect 10.6.65.78
// @connect 10.6.65.67
// @connect 10.6.65.76
// @connect 10.6.65.81
// @connect 10.6.65.80
// @connect 10.6.65.172
// @connect 10.6.65.157
// @connect 10.6.65.69
// @connect 10.6.65.162
// @connect 10.6.65.156
// @connect 10.6.65.113
// @connect 10.6.65.158
// @connect 10.6.65.164
// @connect 10.6.65.171
// @connect 10.6.65.110
// @connect 10.6.65.155
// @connect 10.6.65.174
// @connect 10.6.65.104
// @connect 10.6.65.127
// @connect 10.6.65.176
// @connect 10.6.65.112
// @connect 10.6.65.167
// @connect 10.6.65.173
// @connect 10.6.65.181
// @connect 10.6.65.161
// @connect 10.6.65.118
// @connect 10.6.65.131
// @connect 10.6.65.184
// @connect 10.6.65.109
// @connect 10.6.65.170
// @connect 10.6.65.183
// @connect 10.6.65.175
// @connect 10.6.65.160
// @connect 10.6.65.143
// @connect 10.6.65.121
// @connect 10.6.65.165
// @connect 10.6.65.125
// @connect 10.6.65.108
// @connect 10.6.65.103
// @connect 10.6.65.166
// @connect 10.6.65.168
// @connect 10.6.65.139
// @connect 10.6.65.106
// @connect 10.6.65.163
// @connect 10.6.65.119
// @connect 10.6.65.182
// @connect 10.6.65.141
// @connect 10.6.65.142
// @connect 10.6.65.136
// @connect 10.6.65.116
// @connect 10.6.65.135
// @connect 10.6.65.107
// @connect 10.6.65.133
// @connect 10.6.65.152
// @connect 10.6.65.169
// @connect 10.6.65.105
// @connect 10.6.22.24
// @connect 10.6.65.178
// @connect 10.6.65.140
// @connect 10.6.65.129
// @connect 10.6.65.177
// @connect 10.6.41.148
// @connect 10.6.65.137
// @connect 10.6.65.154
// @connect 10.6.65.146
// @connect 10.6.65.180
// @connect 10.6.65.120
// @connect 10.6.65.123
// @connect 10.6.65.117
// @connect 10.6.65.134
// @connect 10.6.65.111
// @connect 10.6.65.122
// @connect 10.6.65.132
// @connect 10.6.65.179
// @connect 10.6.65.144
// @connect 10.6.65.147
// @connect 10.6.65.128
// @connect 10.6.65.153
// @connect 10.6.65.145
// @connect 10.6.65.150
// @connect 10.6.65.151
// @connect 10.6.65.124
// @connect 10.6.65.148
// @connect 10.6.65.149
// @connect 10.6.65.130
// @connect 10.6.65.224
// @connect 10.6.65.205
// @connect 10.6.65.202
// @connect 10.6.65.199
// @connect 10.6.65.201
// @connect 10.6.65.230
// @connect 10.6.65.225
// @connect 10.6.65.241
// @connect 10.6.65.238
// @connect 10.6.65.209
// @connect 10.6.65.218
// @connect 10.6.65.206
// @connect 10.6.65.223
// @connect 10.6.65.229
// @connect 10.6.65.211
// @connect 10.6.65.208
// @connect 10.6.65.227
// @connect 10.6.65.236
// @connect 10.6.65.214
// @connect 10.6.65.232
// @connect 10.6.65.235
// @connect 10.6.65.228
// @connect 10.6.65.237
// @connect 10.6.65.234
// @connect 10.6.65.216
// @connect 10.6.65.213
// @connect 10.6.65.203
// @connect 10.6.65.217
// @connect 10.6.65.207
// @connect 10.6.65.222
// @connect 10.6.65.221
// @connect 10.6.65.226
// @connect 10.6.66.10
// @connect 10.6.65.233
// @connect 10.6.65.210
// @connect 10.6.66.14
// @connect 10.6.66.8
// @connect 10.6.66.9
// @connect 10.6.65.204
// @connect 10.6.65.247
// @connect 10.6.66.15
// @connect 10.6.66.5
// @connect 10.6.65.246
// @connect 10.6.65.252
// @connect 10.6.66.12
// @connect 10.6.65.253
// @connect 10.6.66.6
// @connect 10.6.66.0
// @connect 10.6.65.248
// @connect 10.6.66.16
// @connect 10.6.66.1
// @connect 10.6.65.254
// @connect 10.6.65.239
// @connect 10.6.66.4
// @connect 10.6.65.249
// @connect 10.6.66.13
// @connect 10.6.66.7
// @connect 10.6.65.244
// @connect 10.6.66.18
// @connect 10.6.65.243
// @connect 10.6.65.187
// @connect 10.6.65.197
// @connect 10.6.65.185
// @connect 10.6.65.190
// @connect 10.6.65.242
// @connect 10.6.65.196
// @connect 10.6.65.188
// @connect 10.6.65.191
// @connect 10.6.65.250
// @connect 10.6.65.186
// @connect 10.6.65.198
// @connect 10.6.65.245
// @connect 10.6.65.195
// @connect 10.6.52.23
// @connect 10.6.52.40
// @connect 10.6.52.35
// @connect 10.6.52.32
// @connect 10.6.52.22
// @connect 10.6.52.2
// @connect 10.6.52.34
// @connect 10.6.52.8
// @connect 10.6.52.29
// @connect 10.6.52.13
// @connect 10.6.52.38
// @connect 10.6.52.19
// @connect 10.6.52.30
// @connect 10.6.52.31
// @connect 10.6.52.15
// @connect 10.6.52.12
// @connect 10.6.52.20
// @connect 10.6.52.14
// @connect 10.6.52.10
// @connect 10.6.52.25
// @connect 10.6.52.7
// @connect 10.6.52.39
// @connect 10.6.52.28
// @connect 10.6.52.18
// @connect 10.6.52.6
// @connect 10.6.52.9
// @connect 10.6.52.36
// @connect 10.6.52.5
// @connect 10.6.52.26
// @connect 10.6.52.27
// @connect 10.6.52.16
// @connect 10.6.52.11
// @connect 10.6.52.17
// @connect 10.6.52.24
// @connect 10.6.52.4
// @connect 10.6.52.21
// @connect 10.6.52.37
// @connect 10.6.52.98
// @connect 10.6.52.99
// @connect 10.6.52.92
// @connect 10.6.52.130
// @connect 10.6.52.156
// @connect 10.6.52.86
// @connect 10.6.52.71
// @connect 10.6.52.72
// @connect 10.6.52.131
// @connect 10.6.52.85
// @connect 10.6.52.94
// @connect 10.6.52.142
// @connect 10.6.58.104
// @connect 10.6.52.135
// @connect 10.6.52.140
// @connect 10.6.52.83
// @connect 10.6.22.38
// @connect 10.6.52.151
// @connect 10.6.52.104
// @connect 10.6.52.75
// @connect 10.6.52.97
// @connect 10.6.52.96
// @connect 10.6.52.143
// @connect 10.6.52.87
// @connect 10.6.52.101
// @connect 10.6.52.134
// @connect 10.6.52.147
// @connect 10.6.52.132
// @connect 10.6.52.146
// @connect 10.6.52.139
// @connect 10.6.52.91
// @connect 10.6.52.95
// @connect 10.6.52.138
// @connect 10.6.52.141
// @connect 10.6.52.89
// @connect 10.6.52.144
// @connect 10.6.52.90
// @connect 10.6.52.136
// @connect 10.6.52.79
// @connect 10.6.52.73
// @connect 10.6.52.133
// @connect 10.6.52.145
// @connect 10.6.52.105
// @connect 10.6.52.77
// @connect 10.6.52.70
// @connect 10.6.52.78
// @connect 10.6.52.82
// @connect 10.6.52.88
// @connect 10.6.52.68
// @connect 10.6.52.81
// @connect 10.6.52.80
// @connect 10.6.52.93
// @connect 10.6.52.100
// @connect 10.6.52.103
// @connect 10.6.52.102
// @connect 10.6.52.74
// @connect 10.6.52.69
// @connect 10.6.52.84
// @connect 10.6.29.7
// @connect 10.6.53.31
// @connect 10.6.52.216
// @connect 10.6.53.36
// @connect 10.6.53.25
// @connect 10.6.52.226
// @connect 10.6.52.167
// @connect 10.6.53.29
// @connect 10.6.53.33
// @connect 10.6.53.13
// @connect 10.6.52.155
// @connect 10.6.53.9
// @connect 10.6.53.37
// @connect 10.6.53.34
// @connect 10.6.52.154
// @connect 10.6.53.14
// @connect 10.6.52.233
// @connect 10.6.53.35
// @connect 10.6.53.4
// @connect 10.6.53.6
// @connect 10.6.53.26
// @connect 10.6.52.162
// @connect 10.6.52.222
// @connect 10.6.52.163
// @connect 10.6.53.18
// @connect 10.6.52.164
// @connect 10.6.52.218
// @connect 10.6.53.28
// @connect 10.6.52.229
// @connect 10.6.53.15
// @connect 10.6.52.223
// @connect 10.6.53.12
// @connect 10.6.53.11
// @connect 10.6.53.2
// @connect 10.6.53.19
// @connect 10.6.52.158
// @connect 10.6.52.153
// @connect 10.6.52.150
// @connect 10.6.52.227
// @connect 10.6.52.221
// @connect 10.6.52.159
// @connect 10.6.53.17
// @connect 10.6.52.148
// @connect 10.6.52.160
// @connect 10.6.52.231
// @connect 10.6.52.225
// @connect 10.6.52.234
// @connect 10.6.53.7
// @connect 10.6.53.24
// @connect 10.6.52.219
// @connect 10.6.53.21
// @connect 10.6.53.10
// @connect 10.6.52.161
// @connect 10.6.53.32
// @connect 10.6.52.165
// @connect 10.6.53.30
// @connect 10.6.52.149
// @connect 10.6.52.152
// @connect 10.6.52.230
// @connect 10.6.53.16
// @connect 10.6.53.22
// @connect 10.6.53.27
// @connect 10.6.52.215
// @connect 10.6.52.228
// @connect 10.6.52.220
// @connect 10.6.52.157
// @connect 10.6.52.217
// @connect 10.6.53.3
// @connect 10.6.53.20
// @connect 10.6.52.208
// @connect 10.6.53.8
// @connect 10.6.53.5
// @connect 10.6.52.232
// @connect 10.6.11.26
// @connect 10.6.52.213
// @connect 10.6.52.211
// @connect 10.6.52.166
// @connect 10.6.19.31
// @connect 10.6.9.140
// @connect 10.6.52.207
// @connect 10.6.7.73
// @connect 10.6.52.206
// @connect 10.6.5.167
// @connect 10.6.52.212
// @connect 10.6.20.75
// @connect 10.6.21.39
// @connect 10.6.1.39
// @connect 10.6.19.29
// @connect 10.6.2.84
// @connect 10.6.18.30
// @connect 10.6.52.209
// @connect 10.6.26.23
// @connect 10.6.52.210
// @connect 10.6.53.161
// @connect 10.6.53.82
// @connect 10.6.53.140
// @connect 10.6.53.145
// @connect 10.6.53.104
// @connect 10.6.53.76
// @connect 10.6.53.71
// @connect 10.6.53.150
// @connect 10.6.53.70
// @connect 10.6.53.94
// @connect 10.6.53.132
// @connect 10.6.53.103
// @connect 10.6.53.135
// @connect 10.6.53.93
// @connect 10.6.53.155
// @connect 10.6.53.97
// @connect 10.6.53.91
// @connect 10.6.53.139
// @connect 10.6.53.80
// @connect 10.6.53.105
// @connect 10.6.53.74
// @connect 10.6.53.66
// @connect 10.6.53.142
// @connect 10.6.53.85
// @connect 10.6.53.144
// @connect 10.6.53.147
// @connect 10.6.53.86
// @connect 10.6.53.157
// @connect 10.6.53.81
// @connect 10.6.53.131
// @connect 10.6.53.133
// @connect 10.6.53.75
// @connect 10.6.53.96
// @connect 10.6.53.73
// @connect 10.6.53.95
// @connect 10.6.53.163
// @connect 10.6.53.148
// @connect 10.6.53.88
// @connect 10.6.53.69
// @connect 10.6.53.90
// @connect 10.6.53.154
// @connect 10.6.53.164
// @connect 10.6.53.143
// @connect 10.6.53.99
// @connect 10.6.53.158
// @connect 10.6.53.106
// @connect 10.6.53.153
// @connect 10.6.53.98
// @connect 10.6.21.231
// @connect 10.6.53.87
// @connect 10.6.53.89
// @connect 10.6.53.149
// @connect 10.6.53.146
// @connect 10.6.53.67
// @connect 10.6.53.83
// @connect 10.6.53.138
// @connect 10.6.53.79
// @connect 10.6.53.141
// @connect 10.6.53.137
// @connect 10.6.53.156
// @connect 10.6.53.72
// @connect 10.6.53.162
// @connect 10.6.53.102
// @connect 10.6.53.165
// @connect 10.6.53.101
// @connect 10.6.53.77
// @connect 10.6.53.136
// @connect 10.6.53.160
// @connect 10.6.53.78
// @connect 10.6.53.151
// @connect 10.6.53.130
// @connect 10.6.53.152
// @connect 10.6.53.84
// @connect 10.6.53.92
// @connect 10.6.53.134
// @connect 10.6.53.198
// @connect 10.6.54.34
// @connect 10.6.53.199
// @connect 10.6.53.209
// @connect 10.6.54.14
// @connect 10.6.54.8
// @connect 10.6.54.37
// @connect 10.6.54.36
// @connect 10.6.53.211
// @connect 10.6.53.200
// @connect 10.6.54.31
// @connect 10.6.54.33
// @connect 10.6.54.7
// @connect 10.6.53.196
// @connect 10.6.53.233
// @connect 10.6.54.23
// @connect 10.6.54.12
// @connect 10.6.53.205
// @connect 10.6.53.201
// @connect 10.6.54.28
// @connect 10.6.53.210
// @connect 10.6.53.202
// @connect 10.6.53.215
// @connect 10.6.54.15
// @connect 10.6.53.213
// @connect 10.6.53.212
// @connect 10.6.53.203
// @connect 10.6.53.206
// @connect 10.6.54.3
// @connect 10.6.53.216
// @connect 10.6.53.197
// @connect 10.6.54.27
// @connect 10.6.53.219
// @connect 10.6.54.30
// @connect 10.6.53.214
// @connect 10.6.53.194
// @connect 10.6.53.224
// @connect 10.6.54.9
// @connect 10.6.54.17
// @connect 10.6.54.13
// @connect 10.6.53.208
// @connect 10.6.53.220
// @connect 10.6.53.222
// @connect 10.6.53.228
// @connect 10.6.54.16
// @connect 10.6.54.38
// @connect 10.6.54.19
// @connect 10.6.54.2
// @connect 10.6.54.18
// @connect 10.6.53.223
// @connect 10.6.54.11
// @connect 10.6.53.195
// @connect 10.6.53.225
// @connect 10.6.53.227
// @connect 10.6.53.204
// @connect 10.6.53.230
// @connect 10.6.54.21
// @connect 10.6.54.35
// @connect 10.6.53.231
// @connect 10.6.54.26
// @connect 10.6.54.5
// @connect 10.6.53.207
// @connect 10.6.54.10
// @connect 10.6.54.32
// @connect 10.6.54.25
// @connect 10.6.54.24
// @connect 10.6.53.217
// @connect 10.6.53.229
// @connect 10.6.54.20
// @connect 10.6.54.6
// @connect 10.6.54.4
// @connect 10.6.54.22
// @connect 10.6.53.226
// @connect 10.6.53.218
// @connect 10.6.53.221
// @connect 10.6.66.45
// @connect 10.6.66.21
// @connect 10.6.66.11
// @connect 10.6.66.25
// @connect 10.6.66.30
// @connect 10.6.66.17
// @connect 10.6.66.27
// @connect 10.6.66.28
// @connect 10.6.66.19
// @connect 10.6.66.40
// @connect 10.6.66.23
// @connect 10.6.66.43
// @connect 10.6.66.33
// @connect 10.6.66.48
// @connect 10.6.66.31
// @connect 10.6.66.29
// @connect 10.6.66.47
// @connect 10.6.66.26
// @connect 10.6.66.24
// @connect 10.6.66.35
// @connect 10.6.66.36
// @connect 10.6.65.65
// @connect 10.6.66.32
// @connect 10.6.66.41
// @connect 10.6.66.22
// @connect 10.6.66.46
// @connect 10.6.66.34
// @connect 10.6.66.20
// @connect 10.6.66.42
// @connect 10.6.66.37
// @connect 10.6.66.39
// @connect 10.6.66.44
// @connect 10.6.54.105
// @connect 10.6.54.167
// @connect 10.6.54.165
// @connect 10.6.55.39
// @connect 10.6.54.163
// @connect 10.6.55.37
// @connect 10.6.54.230
// @connect 10.6.54.100
// @connect 10.6.54.94
// @connect 10.6.55.36
// @connect 10.6.54.103
// @connect 10.6.54.98
// @connect 10.6.54.97
// @connect 10.6.54.169
// @connect 10.6.54.95
// @connect 10.6.54.104
// @connect 10.6.54.93
// @connect 10.6.54.96
// @connect 10.6.54.99
// @connect 10.6.54.162
// @connect 10.6.54.92
// @connect 10.6.54.160
// @connect 10.6.54.164
// @connect 10.6.54.161
// @connect 10.6.54.166
// @connect 10.6.54.101
// @connect 10.6.54.231
// @connect 10.6.54.232
// @connect 10.6.54.233
// @connect 10.6.55.38
// @connect 10.6.55.40
// @connect 10.6.55.31
// @connect 10.6.55.34
// @connect 10.6.55.17
// @connect 10.6.55.35
// @connect 10.6.55.32
// @connect 10.6.55.33
// @connect 10.6.65.3
// @connect 10.6.64.43
// @connect 10.6.64.70
// @connect 10.6.64.80
// @connect 10.6.65.189
// @connect 10.6.64.64
// @connect 10.6.65.193
// @connect 10.6.65.159
// @connect 10.6.65.200
// @connect 10.6.65.212
// @connect 10.6.64.245
// @connect 10.6.57.72
// @connect 10.6.57.105
// @connect 10.6.57.165
// @connect 10.6.59.86
// @connect 10.6.59.66
// @connect 10.6.59.87
// @connect 10.6.59.68
// @connect 10.6.57.210
// @connect 10.6.59.89
// @connect 10.6.59.71
// @connect 10.6.41.208
// @connect 10.6.59.94
// @connect 10.6.59.76
// @connect 10.6.57.206
// @connect 10.6.58.22
// @connect 10.6.57.197
// @connect 10.6.57.71
// @connect 10.6.57.158
// @connect 10.6.58.37
// @connect 10.6.59.83
// @connect 10.6.59.92
// @connect 10.6.57.161
// @connect 10.6.58.155
// @connect 10.6.57.164
// @connect 10.6.57.74
// @connect 10.6.57.146
// @connect 10.6.57.135
// @connect 10.6.57.78
// @connect 10.6.62.34
// @connect 10.6.57.160
// @connect 10.6.57.69
// @connect 10.6.57.132
// @connect 10.6.57.137
// @connect 10.6.57.103
// @connect 10.6.57.142
// @connect 10.6.57.75
// @connect 10.6.57.229
// @connect 10.6.57.76
// @connect 10.6.57.167
// @connect 10.6.57.220
// @connect 10.6.57.144
// @connect 10.6.57.166
// @connect 10.6.57.169
// @connect 10.6.57.87
// @connect 10.6.57.80
// @connect 10.6.57.88
// @connect 10.6.57.73
// @connect 10.6.57.84
// @connect 10.6.57.213
// @connect 10.6.57.93
// @connect 10.6.57.104
// @connect 10.6.57.70
// @connect 10.6.57.90
// @connect 10.6.58.18
// @connect 10.6.57.211
// @connect 10.6.57.196
// @connect 10.6.57.226
// @connect 10.6.57.205
// @connect 10.6.57.207
// @connect 10.6.57.204
// @connect 10.6.57.201
// @connect 10.6.57.225
// @connect 10.6.57.224
// @connect 10.6.57.233
// @connect 10.6.57.228
// @connect 10.6.57.230
// @connect 10.6.57.232
// @connect 10.6.57.198
// @connect 10.6.57.219
// @connect 10.6.57.200
// @connect 10.6.57.202
// @connect 10.6.57.227
// @connect 10.6.57.199
// @connect 10.6.58.28
// @connect 10.6.57.194
// @connect 10.6.57.222
// @connect 10.6.58.29
// @connect 10.6.58.19
// @connect 10.6.57.215
// @connect 10.6.57.212
// @connect 10.6.58.24
// @connect 10.6.58.79
// @connect 10.6.58.100
// @connect 10.6.58.20
// @connect 10.6.58.103
// @connect 10.6.58.26
// @connect 10.6.58.7
// @connect 10.6.57.218
// @connect 10.6.58.21
// @connect 10.6.58.40
// @connect 10.6.57.221
// @connect 10.6.58.16
// @connect 10.6.57.195
// @connect 10.6.32.26
// @connect 10.6.41.209
// @connect 10.6.58.23
// @connect 10.6.59.79
// @connect 10.6.59.21
// @connect 10.6.58.25
// @connect 10.6.57.223
// @connect 10.6.58.154
// @connect 10.6.59.35
// @connect 10.6.58.158
// @connect 10.6.59.98
// @connect 10.6.59.36
// @connect 10.6.58.145
// @connect 10.6.58.196
// @connect 10.6.58.232
// @connect 10.6.58.162
// @connect 10.6.58.38
// @connect 10.6.57.203
// @connect 10.6.57.214
// @connect 10.6.58.76
// @connect 10.6.58.67
// @connect 10.6.59.19
// @connect 10.6.58.73
// @connect 10.6.58.209
// @connect 10.6.58.34
// @connect 10.6.58.105
// @connect 10.6.59.27
// @connect 10.6.58.212
// @connect 10.6.58.35
// @connect 10.6.58.134
// @connect 10.6.58.131
// @connect 10.6.58.36
// @connect 10.6.59.99
// @connect 10.6.59.30
// @connect 10.6.58.225
// @connect 10.6.58.11
// @connect 10.6.58.202
// @connect 10.6.58.229
// @connect 10.6.59.31
// @connect 10.6.58.164
// @connect 10.6.59.72
// @connect 10.6.58.132
// @connect 10.6.59.93
// @connect 10.6.59.7
// @connect 10.6.58.228
// @connect 10.6.58.135
// @connect 10.6.58.148
// @connect 10.6.58.69
// @connect 10.6.58.224
// @connect 10.6.58.219
// @connect 10.6.59.17
// @connect 10.6.58.226
// @connect 10.6.58.159
// @connect 10.6.59.101
// @connect 10.6.58.153
// @connect 10.6.58.214
// @connect 10.6.58.169
// @connect 10.6.58.94
// @connect 10.6.59.18
// @connect 10.6.58.83
// @connect 10.6.58.160
// @connect 10.6.58.233
// @connect 10.6.59.32
// @connect 10.6.44.233
// @connect 10.6.41.134
// @connect 10.6.58.213
// @connect 10.6.59.80
// @connect 10.6.59.103
// @connect 10.6.59.3
// @connect 10.6.58.206
// @connect 10.6.59.15
// @connect 10.6.58.230
// @connect 10.6.59.95
// @connect 10.6.58.200
// @connect 10.6.57.217
// @connect 10.6.58.211
// @connect 10.6.58.10
// @connect 10.6.58.217
// @connect 10.6.59.6
// @connect 10.6.58.75
// @connect 10.6.58.96
// @connect 10.6.58.78
// @connect 10.6.58.133
// @connect 10.6.59.69
// @connect 10.6.58.216
// @connect 10.6.59.11
// @connect 10.6.58.12
// @connect 10.6.58.197
// @connect 10.6.59.90
// @connect 10.6.58.221
// @connect 10.6.58.207
// @connect 10.6.58.85
// @connect 10.6.58.203
// @connect 10.6.59.78
// @connect 10.6.59.96
// @connect 10.6.59.4
// @connect 10.6.59.40
// @connect 10.6.59.8
// @connect 10.6.58.165
// @connect 10.6.58.198
// @connect 10.6.58.90
// @connect 10.6.41.131
// @connect 10.6.58.98
// @connect 10.6.59.85
// @connect 10.6.58.215
// @connect 10.6.59.28
// @connect 10.6.58.147
// @connect 10.6.58.222
// @connect 10.6.58.143
// @connect 10.6.59.67
// @connect 10.6.41.203
// @connect 10.6.59.38
// @connect 10.6.59.104
// @connect 10.6.59.102
// @connect 10.6.58.223
// @connect 10.6.58.157
// @connect 10.6.58.231
// @connect 10.6.58.195
// @connect 10.6.59.75
// @connect 10.6.58.144
// @connect 10.6.59.25
// @connect 10.6.59.12
// @connect 10.6.58.82
// @connect 10.6.58.140
// @connect 10.6.59.41
// @connect 10.6.58.204
// @connect 10.6.58.201
// @connect 10.6.59.77
// @connect 10.6.58.152
// @connect 10.6.59.33
// @connect 10.6.58.141
// @connect 10.6.59.24
// @connect 10.6.58.87
// @connect 10.6.58.161
// @connect 10.6.59.14
// @connect 10.6.59.22
// @connect 10.6.58.150
// @connect 10.6.59.26
// @connect 10.6.59.2
// @connect 10.6.59.39
// @connect 10.6.59.97
// @connect 10.6.58.194
// @connect 10.6.59.16
// @connect 10.6.58.167
// @connect 10.6.59.23
// @connect 10.6.59.84
// @connect 10.6.59.9
// @connect 10.6.58.4
// @connect 10.6.58.208
// @connect 10.6.58.199
// @connect 10.6.59.29
// @connect 10.6.58.205
// @connect 10.6.59.74
// @connect 10.6.58.227
// @connect 10.6.58.17
// @connect 10.6.58.210
// @connect 10.6.58.218
// @connect 10.6.59.82
// @connect 10.6.59.70
// @connect 10.6.45.145
// @connect 10.6.45.103
// @connect 10.6.45.149
// @connect 10.6.45.94
// @connect 10.6.44.143
// @connect 10.6.45.85
// @connect 10.6.45.98
// @connect 10.6.45.159
// @connect 10.6.45.72
// @connect 10.6.44.149
// @connect 10.6.44.21
// @connect 10.6.45.148
// @connect 10.6.45.82
// @connect 10.6.45.73
// @connect 10.6.45.139
// @connect 10.6.44.15
// @connect 10.6.45.163
// @connect 10.6.44.197
// @connect 10.6.45.74
// @connect 10.6.44.217
// @connect 10.6.44.212
// @connect 10.6.45.27
// @connect 10.6.44.146
// @connect 10.6.45.166
// @connect 10.6.44.164
// @connect 10.6.44.133
// @connect 10.6.45.158
// @connect 10.6.44.25
// @connect 10.6.44.155
// @connect 10.6.45.104
// @connect 10.6.45.89
// @connect 10.6.45.80
// @connect 10.6.45.141
// @connect 10.6.45.137
// @connect 10.6.44.219
// @connect 10.6.45.69
// @connect 10.6.45.81
// @connect 10.6.44.136
// @connect 10.6.44.203
// @connect 10.6.45.37
// @connect 10.6.44.150
// @connect 10.6.44.209
// @connect 10.6.45.134
// @connect 10.6.44.206
// @connect 10.6.25.102
// @connect 10.6.45.13
// @connect 10.6.45.169
// @connect 10.6.45.11
// @connect 10.6.45.140
// @connect 10.6.44.74
// @connect 10.6.44.27
// @connect 10.6.45.97
// @connect 10.6.45.136
// @connect 10.6.44.166
// @connect 10.6.44.162
// @connect 10.6.45.14
// @connect 10.6.44.134
// @connect 10.6.45.135
// @connect 10.6.45.162
// @connect 10.6.45.10
// @connect 10.6.45.154
// @connect 10.6.45.167
// @connect 10.6.45.153
// @connect 10.6.45.31
// @connect 10.6.45.90
// @connect 10.6.45.88
// @connect 10.6.44.204
// @connect 10.6.45.156
// @connect 10.6.45.165
// @connect 10.6.44.90
// @connect 10.6.45.67
// @connect 10.6.44.82
// @connect 10.6.45.87
// @connect 10.6.45.146
// @connect 10.6.44.94
// @connect 10.6.44.13
// @connect 10.6.44.88
// @connect 10.6.45.71
// @connect 10.6.44.99
// @connect 10.6.44.196
// @connect 10.6.44.91
// @connect 10.6.44.151
// @connect 10.6.45.8
// @connect 10.6.44.154
// @connect 10.6.45.152
// @connect 10.6.44.200
// @connect 10.6.44.135
// @connect 10.6.45.132
// @connect 10.6.45.96
// @connect 10.6.45.78
// @connect 10.6.45.92
// @connect 10.6.44.103
// @connect 10.6.44.137
// @connect 10.6.45.130
// @connect 10.6.44.16
// @connect 10.6.45.155
// @connect 10.6.44.224
// @connect 10.6.44.87
// @connect 10.6.44.138
// @connect 10.6.44.225
// @connect 10.6.44.218
// @connect 10.6.44.147
// @connect 10.6.44.157
// @connect 10.6.44.101
// @connect 10.6.44.70
// @connect 10.6.44.2
// @connect 10.6.45.76
// @connect 10.6.44.84
// @connect 10.6.44.152
// @connect 10.6.45.20
// @connect 10.6.45.168
// @connect 10.6.45.144
// @connect 10.6.45.12
// @connect 10.6.44.14
// @connect 10.6.44.153
// @connect 10.6.45.100
// @connect 10.6.44.202
// @connect 10.6.44.230
// @connect 10.6.45.147
// @connect 10.6.45.99
// @connect 10.6.44.34
// @connect 10.6.44.161
// @connect 10.6.45.101
// @connect 10.6.44.67
// @connect 10.6.44.228
// @connect 10.6.45.33
// @connect 10.6.44.36
// @connect 10.6.44.79
// @connect 10.6.44.105
// @connect 10.6.44.66
// @connect 10.6.45.131
// @connect 10.6.44.165
// @connect 10.6.44.28
// @connect 10.6.44.130
// @connect 10.6.44.10
// @connect 10.6.44.96
// @connect 10.6.44.32
// @connect 10.6.44.68
// @connect 10.6.44.18
// @connect 10.6.44.17
// @connect 10.6.44.160
// @connect 10.6.44.144
// @connect 10.6.45.79
// @connect 10.6.44.75
// @connect 10.6.44.92
// @connect 10.6.45.35
// @connect 10.6.45.102
// @connect 10.6.45.23
// @connect 10.6.45.66
// @connect 10.6.45.75
// @connect 10.6.44.73
// @connect 10.6.45.143
// @connect 10.6.44.38
// @connect 10.6.44.77
// @connect 10.6.44.3
// @connect 10.6.44.205
// @connect 10.6.44.213
// @connect 10.6.44.23
// @connect 10.6.45.150
// @connect 10.6.44.86
// @connect 10.6.24.86
// @connect 10.6.44.139
// @connect 10.6.44.95
// @connect 10.6.44.97
// @connect 10.6.44.9
// @connect 10.6.45.161
// @connect 10.6.44.226
// @connect 10.6.44.201
// @connect 10.6.44.41
// @connect 10.6.44.40
// @connect 10.6.45.26
// @connect 10.6.45.91
// @connect 10.6.25.132
// @connect 10.6.45.38
// @connect 10.6.44.215
// @connect 10.6.45.18
// @connect 10.6.45.29
// @connect 10.6.44.100
// @connect 10.6.45.68
// @connect 10.6.44.216
// @connect 10.6.44.24
// @connect 10.6.45.3
// @connect 10.6.44.98
// @connect 10.6.44.85
// @connect 10.6.44.168
// @connect 10.6.45.36
// @connect 10.6.44.37
// @connect 10.6.45.28
// @connect 10.6.45.2
// @connect 10.6.44.89
// @connect 10.6.45.21
// @connect 10.6.44.30
// @connect 10.6.44.167
// @connect 10.6.45.105
// @connect 10.6.45.39
// @connect 10.6.44.140
// @connect 10.6.45.7
// @connect 10.6.44.8
// @connect 10.6.45.25
// @connect 10.6.52.66
// @connect 10.6.44.83
// @connect 10.6.44.148
// @connect 10.6.45.70
// @connect 10.6.45.5
// @connect 10.6.44.4
// @connect 10.6.44.145
// @connect 10.6.44.6
// @connect 10.6.45.24
// @connect 10.6.45.17
// @connect 10.6.45.30
// @connect 10.6.44.69
// @connect 10.6.44.195
// @connect 10.6.44.33
// @connect 10.6.44.227
// @connect 10.6.45.77
// @connect 10.6.45.6
// @connect 10.6.44.211
// @connect 10.6.44.142
// @connect 10.6.44.210
// @connect 10.6.45.22
// @connect 10.6.44.39
// @connect 10.6.44.194
// @connect 10.6.44.93
// @connect 10.6.44.72
// @connect 10.6.45.86
// @connect 10.6.44.78
// @connect 10.6.45.15
// @connect 10.6.44.220
// @connect 10.6.45.40
// @connect 10.6.26.24
// @connect 10.6.44.31
// @connect 10.6.44.5
// @connect 10.6.44.26
// @connect 10.6.44.29
// @connect 10.6.44.35
// @connect 10.6.44.71
// @connect 10.6.44.7
// @connect 10.6.45.34
// @connect 10.6.44.214
// @connect 10.6.45.16
// @connect 10.6.44.199
// @connect 10.6.45.4
// @connect 10.6.44.12
// @connect 10.6.45.19
// @connect 10.6.44.81
// @connect 10.6.44.208
// @connect 10.6.44.131
// @connect 10.6.44.158
// @connect 10.6.44.80
// @connect 10.6.45.84
// @connect 10.6.44.22
// @connect 10.6.44.102
// @connect 10.6.44.222
// @connect 10.6.44.163
// @connect 10.6.44.141
// @connect 10.6.44.20
// @connect 10.6.45.32
// @connect 10.6.44.11
// @connect 10.6.44.104
// @connect 10.6.44.132
// @connect 10.6.44.198
// @connect 10.6.45.9
// @connect 10.6.58.81
// @connect 10.6.46.16
// @connect 10.6.45.230
// @connect 10.6.45.231
// @connect 10.6.46.28
// @connect 10.6.46.30
// @connect 10.6.45.212
// @connect 10.6.45.225
// @connect 10.6.45.223
// @connect 10.6.45.209
// @connect 10.6.45.220
// @connect 10.6.46.29
// @connect 10.6.45.219
// @connect 10.6.44.19
// @connect 10.6.45.197
// @connect 10.6.45.224
// @connect 10.6.46.32
// @connect 10.6.45.200
// @connect 10.6.45.217
// @connect 10.6.45.207
// @connect 10.6.46.33
// @connect 10.6.45.210
// @connect 10.6.46.22
// @connect 10.6.45.208
// @connect 10.6.45.221
// @connect 10.6.45.199
// @connect 10.6.45.215
// @connect 10.6.45.194
// @connect 10.6.46.2
// @connect 10.6.45.206
// @connect 10.6.46.40
// @connect 10.6.45.218
// @connect 10.6.46.36
// @connect 10.6.44.223
// @connect 10.6.46.34
// @connect 10.6.45.202
// @connect 10.6.46.26
// @connect 10.6.46.23
// @connect 10.6.45.211
// @connect 10.6.45.216
// @connect 10.6.46.17
// @connect 10.6.45.195
// @connect 10.6.45.205
// @connect 10.6.45.142
// @connect 10.6.46.41
// @connect 10.6.46.19
// @connect 10.6.45.151
// @connect 10.6.45.233
// @connect 10.6.46.12
// @connect 10.6.46.4
// @connect 10.6.45.232
// @connect 10.6.45.228
// @connect 10.6.45.203
// @connect 10.6.45.133
// @connect 10.6.45.226
// @connect 10.6.45.214
// @connect 10.6.45.204
// @connect 10.6.45.201
// @connect 10.6.45.229
// @connect 10.6.45.198
// @connect 10.6.46.25
// @connect 10.6.46.27
// @connect 10.6.45.138
// @connect 10.6.46.6
// @connect 10.6.45.222
// @connect 10.6.45.227
// @connect 10.6.45.160
// @connect 10.6.46.104
// @connect 10.6.46.169
// @connect 10.6.46.160
// @connect 10.6.46.167
// @connect 10.6.46.101
// @connect 10.6.46.144
// @connect 10.6.46.89
// @connect 10.6.46.231
// @connect 10.6.46.212
// @connect 10.6.46.228
// @connect 10.6.46.91
// @connect 10.6.46.217
// @connect 10.6.46.70
// @connect 10.6.46.102
// @connect 10.6.46.161
// @connect 10.6.46.155
// @connect 10.6.46.105
// @connect 10.6.46.81
// @connect 10.6.46.137
// @connect 10.6.46.82
// @connect 10.6.46.72
// @connect 10.6.46.3
// @connect 10.6.46.84
// @connect 10.6.46.31
// @connect 10.6.46.98
// @connect 10.6.46.79
// @connect 10.6.46.77
// @connect 10.6.46.148
// @connect 10.6.46.146
// @connect 10.6.46.83
// @connect 10.6.46.10
// @connect 10.6.46.100
// @connect 10.6.46.67
// @connect 10.6.46.75
// @connect 10.6.46.163
// @connect 10.6.46.74
// @connect 10.6.46.15
// @connect 10.6.46.145
// @connect 10.6.46.35
// @connect 10.6.46.132
// @connect 10.6.46.201
// @connect 10.6.46.202
// @connect 10.6.46.68
// @connect 10.6.46.95
// @connect 10.6.46.90
// @connect 10.6.46.97
// @connect 10.6.46.143
// @connect 10.6.46.131
// @connect 10.6.46.76
// @connect 10.6.46.73
// @connect 10.6.46.8
// @connect 10.6.46.88
// @connect 10.6.46.141
// @connect 10.6.46.96
// @connect 10.6.46.103
// @connect 10.6.46.66
// @connect 10.6.46.94
// @connect 10.6.46.166
// @connect 10.6.46.5
// @connect 10.6.46.93
// @connect 10.6.46.154
// @connect 10.6.46.37
// @connect 10.6.46.157
// @connect 10.6.46.220
// @connect 10.6.46.151
// @connect 10.6.46.9
// @connect 10.6.46.168
// @connect 10.6.46.92
// @connect 10.6.46.78
// @connect 10.6.46.204
// @connect 10.6.46.206
// @connect 10.6.46.199
// @connect 10.6.46.24
// @connect 10.6.46.134
// @connect 10.6.46.136
// @connect 10.6.46.164
// @connect 10.6.46.140
// @connect 10.6.46.87
// @connect 10.6.46.139
// @connect 10.6.46.165
// @connect 10.6.46.153
// @connect 10.6.46.162
// @connect 10.6.46.7
// @connect 10.6.46.85
// @connect 10.6.46.158
// @connect 10.6.46.99
// @connect 10.6.46.14
// @connect 10.6.46.152
// @connect 10.6.46.159
// @connect 10.6.46.133
// @connect 10.6.46.130
// @connect 10.6.46.18
// @connect 10.6.46.207
// @connect 10.6.46.150
// @connect 10.6.46.69
// @connect 10.6.46.135
// @connect 10.6.46.142
// @connect 10.6.46.138
// @connect 10.6.46.156
// @connect 10.6.46.147
// @connect 10.6.46.38
// @connect 10.6.46.149
// @connect 10.6.46.216
// @connect 10.6.46.219
// @connect 10.6.46.225
// @connect 10.6.46.200
// @connect 10.6.46.208
// @connect 10.6.46.196
// @connect 10.6.46.226
// @connect 10.6.46.222
// @connect 10.6.46.223
// @connect 10.6.46.227
// @connect 10.6.46.218
// @connect 10.6.45.93
// @connect 10.6.46.205
// @connect 10.6.47.40
// @connect 10.6.46.210
// @connect 10.6.47.2
// @connect 10.6.47.26
// @connect 10.6.47.29
// @connect 10.6.47.81
// @connect 10.6.47.27
// @connect 10.6.47.33
// @connect 10.6.47.5
// @connect 10.6.47.18
// @connect 10.6.47.98
// @connect 10.6.47.17
// @connect 10.6.46.194
// @connect 10.6.47.69
// @connect 10.6.46.203
// @connect 10.6.47.91
// @connect 10.6.47.28
// @connect 10.6.47.75
// @connect 10.6.46.230
// @connect 10.6.47.95
// @connect 10.6.47.96
// @connect 10.6.47.99
// @connect 10.6.47.9
// @connect 10.6.47.76
// @connect 10.6.47.39
// @connect 10.6.47.22
// @connect 10.6.47.67
// @connect 10.6.47.31
// @connect 10.6.47.7
// @connect 10.6.46.221
// @connect 10.6.47.102
// @connect 10.6.47.23
// @connect 10.6.47.88
// @connect 10.6.47.16
// @connect 10.6.47.8
// @connect 10.6.47.72
// @connect 10.6.47.92
// @connect 10.6.47.70
// @connect 10.6.47.6
// @connect 10.6.46.232
// @connect 10.6.47.15
// @connect 10.6.47.12
// @connect 10.6.47.4
// @connect 10.6.47.80
// @connect 10.6.47.87
// @connect 10.6.47.66
// @connect 10.6.47.36
// @connect 10.6.46.209
// @connect 10.6.46.198
// @connect 10.6.47.32
// @connect 10.6.47.103
// @connect 10.6.47.13
// @connect 10.6.47.35
// @connect 10.6.47.74
// @connect 10.6.47.71
// @connect 10.6.47.105
// @connect 10.6.47.24
// @connect 10.6.47.84
// @connect 10.6.47.79
// @connect 10.6.47.82
// @connect 10.6.47.10
// @connect 10.6.47.78
// @connect 10.6.47.37
// @connect 10.6.47.68
// @connect 10.6.47.21
// @connect 10.6.47.73
// @connect 10.6.46.197
// @connect 10.6.47.89
// @connect 10.6.47.97
// @connect 10.6.47.100
// @connect 10.6.47.94
// @connect 10.6.47.25
// @connect 10.6.46.195
// @connect 10.6.47.85
// @connect 10.6.46.20
// @connect 10.6.46.211
// @connect 10.6.46.215
// @connect 10.6.46.214
// @connect 10.6.47.30
// @connect 10.6.47.3
// @connect 10.6.47.14
// @connect 10.6.47.34
// @connect 10.6.46.224
// @connect 10.6.47.86
// @connect 10.6.47.19
// @connect 10.6.47.93
// @connect 10.6.47.104
// @connect 10.6.47.41
// @connect 10.6.47.90
// @connect 10.6.47.101
// @connect 10.6.47.83
// @connect 10.6.47.20
// @connect 10.6.47.38
// @connect 10.6.47.77
// @connect 10.6.47.11
// @connect 10.6.46.71
// @connect 10.6.45.157
// @connect 10.6.57.152
// @connect 10.6.56.144
// @connect 10.6.57.5
// @connect 10.6.56.223
// @connect 10.6.56.2
// @connect 10.6.56.27
// @connect 10.6.56.7
// @connect 10.6.57.24
// @connect 10.6.57.28
// @connect 10.6.56.18
// @connect 10.6.56.162
// @connect 10.6.56.36
// @connect 10.6.62.208
// @connect 10.6.56.39
// @connect 10.6.57.7
// @connect 10.6.56.136
// @connect 10.6.56.161
// @connect 10.6.56.31
// @connect 10.6.56.205
// @connect 10.6.56.41
// @connect 10.6.56.139
// @connect 10.6.57.40
// @connect 10.6.56.9
// @connect 10.6.56.130
// @connect 10.6.56.20
// @connect 10.6.56.166
// @connect 10.6.56.10
// @connect 10.6.56.148
// @connect 10.6.56.15
// @connect 10.6.57.21
// @connect 10.6.56.73
// @connect 10.6.57.95
// @connect 10.6.56.14
// @connect 10.6.56.196
// @connect 10.6.57.17
// @connect 10.6.56.94
// @connect 10.6.56.21
// @connect 10.6.56.88
// @connect 10.6.56.138
// @connect 10.6.56.67
// @connect 10.6.57.6
// @connect 10.6.56.103
// @connect 10.6.56.202
// @connect 10.6.41.154
// @connect 10.6.56.153
// @connect 10.6.56.6
// @connect 10.6.56.222
// @connect 10.6.56.80
// @connect 10.6.56.82
// @connect 10.6.56.154
// @connect 10.6.56.217
// @connect 10.6.56.207
// @connect 10.6.56.209
// @connect 10.6.56.104
// @connect 10.6.56.225
// @connect 10.6.56.146
// @connect 10.6.57.4
// @connect 10.6.56.155
// @connect 10.6.56.3
// @connect 10.6.56.30
// @connect 10.6.56.197
// @connect 10.6.56.203
// @connect 10.6.56.213
// @connect 10.6.56.137
// @connect 10.6.56.90
// @connect 10.6.57.19
// @connect 10.6.56.78
// @connect 10.6.56.149
// @connect 10.6.56.156
// @connect 10.6.57.14
// @connect 10.6.56.167
// @connect 10.6.56.35
// @connect 10.6.56.34
// @connect 10.6.56.38
// @connect 10.6.56.219
// @connect 10.6.56.140
// @connect 10.6.56.84
// @connect 10.6.56.5
// @connect 10.6.56.206
// @connect 10.6.56.11
// @connect 10.6.56.214
// @connect 10.6.56.204
// @connect 10.6.56.98
// @connect 10.6.56.77
// @connect 10.6.56.169
// @connect 10.6.56.33
// @connect 10.6.56.70
// @connect 10.6.56.145
// @connect 10.6.56.198
// @connect 10.6.56.83
// @connect 10.6.56.89
// @connect 10.6.56.160
// @connect 10.6.56.85
// @connect 10.6.56.233
// @connect 10.6.56.96
// @connect 10.6.56.24
// @connect 10.6.56.195
// @connect 10.6.57.8
// @connect 10.6.56.163
// @connect 10.6.56.75
// @connect 10.6.56.72
// @connect 10.6.56.231
// @connect 10.6.56.74
// @connect 10.6.57.15
// @connect 10.6.57.27
// @connect 10.6.56.4
// @connect 10.6.56.227
// @connect 10.6.56.23
// @connect 10.6.56.69
// @connect 10.6.56.170
// @connect 10.6.56.133
// @connect 10.6.56.143
// @connect 10.6.56.212
// @connect 10.6.56.29
// @connect 10.6.56.165
// @connect 10.6.56.131
// @connect 10.6.56.215
// @connect 10.6.56.93
// @connect 10.6.56.37
// @connect 10.6.56.157
// @connect 10.6.56.147
// @connect 10.6.56.105
// @connect 10.6.56.91
// @connect 10.6.56.232
// @connect 10.6.56.66
// @connect 10.6.56.159
// @connect 10.6.56.25
// @connect 10.6.56.164
// @connect 10.6.56.229
// @connect 10.6.56.22
// @connect 10.6.56.142
// @connect 10.6.57.2
// @connect 10.6.56.40
// @connect 10.6.56.28
// @connect 10.6.56.100
// @connect 10.6.56.12
// @connect 10.6.56.150
// @connect 10.6.56.76
// @connect 10.6.56.16
// @connect 10.6.56.19
// @connect 10.6.56.168
// @connect 10.6.56.86
// @connect 10.6.56.220
// @connect 10.6.56.101
// @connect 10.6.56.226
// @connect 10.6.56.152
// @connect 10.6.56.17
// @connect 10.6.56.221
// @connect 10.6.56.71
// @connect 10.6.56.158
// @connect 10.6.56.134
// @connect 10.6.56.201
// @connect 10.6.56.216
// @connect 10.6.56.151
// @connect 10.6.56.199
// @connect 10.6.56.99
// @connect 10.6.56.135
// @connect 10.6.56.194
// @connect 10.6.56.26
// @connect 10.6.56.132
// @connect 10.6.56.13
// @connect 10.6.56.210
// @connect 10.6.56.208
// @connect 10.6.56.141
// @connect 10.6.56.81
// @connect 10.6.56.218
// @connect 10.6.56.211
// @connect 10.6.56.68
// @connect 10.6.46.213
// @connect 10.6.57.37
// @connect 10.6.57.231
// @connect 10.6.57.91
// @connect 10.6.57.168
// @connect 10.6.57.66
// @connect 10.6.57.83
// @connect 10.6.57.82
// @connect 10.6.57.140
// @connect 10.6.57.150
// @connect 10.6.57.79
// @connect 10.6.57.134
// @connect 10.6.57.10
// @connect 10.6.57.31
// @connect 10.6.57.147
// @connect 10.6.57.216
// @connect 10.6.57.101
// @connect 10.6.57.39
// @connect 10.6.41.158
// @connect 10.6.57.22
// @connect 10.6.57.25
// @connect 10.6.57.30
// @connect 10.6.57.209
// @connect 10.6.57.156
// @connect 10.6.57.136
// @connect 10.6.57.67
// @connect 10.6.58.5
// @connect 10.6.57.20
// @connect 10.6.57.33
// @connect 10.6.57.18
// @connect 10.6.57.96
// @connect 10.6.58.6
// @connect 10.6.57.3
// @connect 10.6.57.92
// @connect 10.6.57.141
// @connect 10.6.58.33
// @connect 10.6.57.154
// @connect 10.6.57.68
// @connect 10.6.57.36
// @connect 10.6.57.130
// @connect 10.6.57.26
// @connect 10.6.58.32
// @connect 10.6.58.86
// @connect 10.6.57.94
// @connect 10.6.57.12
// @connect 10.6.57.208
// @connect 10.6.57.151
// @connect 10.6.57.139
// @connect 10.6.57.89
// @connect 10.6.57.100
// @connect 10.6.57.157
// @connect 10.6.57.149
// @connect 10.6.57.163
// @connect 10.6.57.11
// @connect 10.6.57.85
// @connect 10.6.57.38
// @connect 10.6.57.131
// @connect 10.6.58.14
// @connect 10.6.57.98
// @connect 10.6.57.29
// @connect 10.6.58.74
// @connect 10.6.58.30
// @connect 10.6.57.23
// @connect 10.6.58.91
// @connect 10.6.57.41
// @connect 10.6.57.155
// @connect 10.6.58.72
// @connect 10.6.57.35
// @connect 10.6.57.97
// @connect 10.6.58.39
// @connect 10.6.58.13
// @connect 10.6.58.89
// @connect 10.6.57.138
// @connect 10.6.58.15
// @connect 10.6.57.13
// @connect 10.6.57.9
// @connect 10.6.57.143
// @connect 10.6.57.16
// @connect 10.6.57.86
// @connect 10.6.58.88
// @connect 10.6.58.8
// @connect 10.6.58.80
// @connect 10.6.58.77
// @connect 10.6.57.148
// @connect 10.6.58.84
// @connect 10.6.57.153
// @connect 10.6.57.34
// @connect 10.6.58.99
// @connect 10.6.58.93
// @connect 10.6.58.70
// @connect 10.6.41.130
// @connect 10.6.58.95
// @connect 10.6.58.41
// @connect 10.6.57.81
// @connect 10.6.58.2
// @connect 10.6.58.92
// @connect 10.6.58.166
// @connect 10.6.58.163
// @connect 10.6.58.138
// @connect 10.6.58.97
// @connect 10.6.58.130
// @connect 10.6.58.146
// @connect 10.6.58.142
// @connect 10.6.58.136
// @connect 10.6.58.137
// @connect 10.6.58.139
// @connect 10.6.58.149
// @connect 10.6.58.168
// @connect 10.6.58.151
// @connect 10.6.58.102
// @connect 10.6.56.95
// @connect 10.6.58.3
// @connect 10.6.58.66
// @connect 10.6.59.34
// @connect 10.6.59.10
// @connect 10.6.59.37
// @connect 10.6.58.9
// @connect 10.6.44.207
// @connect 10.6.60.18
// @connect 10.6.60.25
// @connect 10.6.60.41
// @connect 10.6.60.31
// @connect 10.6.60.37
// @connect 10.6.60.35
// @connect 10.6.60.24
// @connect 10.6.60.23
// @connect 10.6.60.39
// @connect 10.6.60.8
// @connect 10.6.60.30
// @connect 10.6.60.40
// @connect 10.6.60.28
// @connect 10.6.60.34
// @connect 10.6.60.12
// @connect 10.6.60.22
// @connect 10.6.60.21
// @connect 10.6.60.36
// @connect 10.6.60.2
// @connect 10.6.60.33
// @connect 10.6.60.19
// @connect 10.6.60.32
// @connect 10.6.60.10
// @connect 10.6.60.27
// @connect 10.6.60.29
// @connect 10.6.60.26
// @connect 10.6.60.16
// @connect 10.6.60.38
// @connect 10.6.60.11
// @connect 10.6.60.4
// @connect 10.6.60.20
// @connect 10.6.60.15
// @connect 10.6.60.13
// @connect 10.6.60.7
// @connect 10.6.60.17
// @connect 10.6.60.3
// @connect 10.6.60.6
// @connect 10.6.60.5
// @connect 10.6.60.9
// @connect 10.6.60.14
// @connect 10.6.60.91
// @connect 10.6.60.71
// @connect 10.6.60.77
// @connect 10.6.60.74
// @connect 10.6.60.85
// @connect 10.6.60.79
// @connect 10.6.60.87
// @connect 10.6.60.67
// @connect 10.6.60.68
// @connect 10.6.60.99
// @connect 10.6.60.94
// @connect 10.6.60.81
// @connect 10.6.60.92
// @connect 10.6.60.70
// @connect 10.6.60.98
// @connect 10.6.60.95
// @connect 10.6.60.76
// @connect 10.6.60.84
// @connect 10.6.60.69
// @connect 10.6.60.104
// @connect 10.6.60.83
// @connect 10.6.60.160
// @connect 10.6.60.166
// @connect 10.6.60.105
// @connect 10.6.60.100
// @connect 10.6.60.97
// @connect 10.6.60.73
// @connect 10.6.60.133
// @connect 10.6.60.72
// @connect 10.6.60.82
// @connect 10.6.60.139
// @connect 10.6.60.102
// @connect 10.6.60.143
// @connect 10.6.60.130
// @connect 10.6.41.198
// @connect 10.6.60.165
// @connect 10.6.60.101
// @connect 10.6.60.168
// @connect 10.6.60.78
// @connect 10.6.60.144
// @connect 10.6.60.154
// @connect 10.6.60.156
// @connect 10.6.60.140
// @connect 10.6.60.142
// @connect 10.6.60.88
// @connect 10.6.60.66
// @connect 10.6.60.141
// @connect 10.6.60.146
// @connect 10.6.60.89
// @connect 10.6.60.153
// @connect 10.6.60.147
// @connect 10.6.60.162
// @connect 10.6.60.158
// @connect 10.6.60.86
// @connect 10.6.60.132
// @connect 10.6.60.90
// @connect 10.6.60.80
// @connect 10.6.60.163
// @connect 10.6.60.159
// @connect 10.6.60.93
// @connect 10.6.60.137
// @connect 10.6.60.151
// @connect 10.6.60.135
// @connect 10.6.60.167
// @connect 10.6.60.152
// @connect 10.6.60.134
// @connect 10.6.60.155
// @connect 10.6.60.138
// @connect 10.6.60.149
// @connect 10.6.60.131
// @connect 10.6.60.103
// @connect 10.6.60.145
// @connect 10.6.60.136
// @connect 10.6.60.161
// @connect 10.6.60.169
// @connect 10.6.60.96
// @connect 10.6.60.150
// @connect 10.6.60.75
// @connect 10.6.60.148
// @connect 10.6.60.198
// @connect 10.6.60.226
// @connect 10.6.60.195
// @connect 10.6.60.222
// @connect 10.6.60.224
// @connect 10.6.60.202
// @connect 10.6.60.201
// @connect 10.6.60.221
// @connect 10.6.60.209
// @connect 10.6.60.220
// @connect 10.6.60.232
// @connect 10.6.60.206
// @connect 10.6.60.225
// @connect 10.6.60.210
// @connect 10.6.60.214
// @connect 10.6.60.200
// @connect 10.6.60.203
// @connect 10.6.60.231
// @connect 10.6.60.219
// @connect 10.6.60.230
// @connect 10.6.60.228
// @connect 10.6.60.215
// @connect 10.6.60.207
// @connect 10.6.60.212
// @connect 10.6.60.217
// @connect 10.6.60.227
// @connect 10.6.60.213
// @connect 10.6.60.197
// @connect 10.6.60.233
// @connect 10.6.60.218
// @connect 10.6.60.223
// @connect 10.6.60.211
// @connect 10.6.60.216
// @connect 10.6.60.208
// @connect 10.6.60.199
// @connect 10.6.60.229
// @connect 10.6.60.204
// @connect 10.6.60.205
// @connect 10.6.60.194
// @connect 10.6.61.27
// @connect 10.6.61.18
// @connect 10.6.61.67
// @connect 10.6.61.41
// @connect 10.6.61.23
// @connect 10.6.61.4
// @connect 10.6.61.38
// @connect 10.6.61.24
// @connect 10.6.61.14
// @connect 10.6.61.8
// @connect 10.6.61.31
// @connect 10.6.61.12
// @connect 10.6.61.89
// @connect 10.6.61.17
// @connect 10.6.61.30
// @connect 10.6.61.71
// @connect 10.6.61.29
// @connect 10.6.61.26
// @connect 10.6.61.66
// @connect 10.6.61.75
// @connect 10.6.61.94
// @connect 10.6.61.33
// @connect 10.6.61.91
// @connect 10.6.61.35
// @connect 10.6.61.5
// @connect 10.6.61.34
// @connect 10.6.61.20
// @connect 10.6.61.11
// @connect 10.6.61.82
// @connect 10.6.61.21
// @connect 10.6.61.13
// @connect 10.6.61.16
// @connect 10.6.61.73
// @connect 10.6.61.9
// @connect 10.6.61.70
// @connect 10.6.61.79
// @connect 10.6.61.6
// @connect 10.6.61.95
// @connect 10.6.61.28
// @connect 10.6.61.39
// @connect 10.6.61.86
// @connect 10.6.61.96
// @connect 10.6.61.78
// @connect 10.6.61.102
// @connect 10.6.61.98
// @connect 10.6.61.36
// @connect 10.6.61.80
// @connect 10.6.61.7
// @connect 10.6.61.2
// @connect 10.6.61.101
// @connect 10.6.61.19
// @connect 10.6.61.83
// @connect 10.6.61.69
// @connect 10.6.61.104
// @connect 10.6.61.3
// @connect 10.6.61.25
// @connect 10.6.61.76
// @connect 10.6.61.97
// @connect 10.6.61.84
// @connect 10.6.61.90
// @connect 10.6.61.40
// @connect 10.6.61.92
// @connect 10.6.61.99
// @connect 10.6.61.37
// @connect 10.6.61.100
// @connect 10.6.61.32
// @connect 10.6.61.103
// @connect 10.6.41.160
// @connect 10.6.61.93
// @connect 10.6.61.87
// @connect 10.6.61.74
// @connect 10.6.61.72
// @connect 10.6.61.10
// @connect 10.6.61.81
// @connect 10.6.61.157
// @connect 10.6.61.133
// @connect 10.6.61.134
// @connect 10.6.61.137
// @connect 10.6.61.155
// @connect 10.6.61.132
// @connect 10.6.61.215
// @connect 10.6.61.223
// @connect 10.6.61.209
// @connect 10.6.61.220
// @connect 10.6.61.162
// @connect 10.6.61.130
// @connect 10.6.61.154
// @connect 10.6.61.217
// @connect 10.6.61.153
// @connect 10.6.61.201
// @connect 10.6.61.199
// @connect 10.6.61.228
// @connect 10.6.61.218
// @connect 10.6.61.131
// @connect 10.6.61.227
// @connect 10.6.61.210
// @connect 10.6.61.150
// @connect 10.6.61.233
// @connect 10.6.61.202
// @connect 10.6.61.225
// @connect 10.6.61.146
// @connect 10.6.61.212
// @connect 10.6.61.230
// @connect 10.6.61.148
// @connect 10.6.61.211
// @connect 10.6.61.165
// @connect 10.6.61.224
// @connect 10.6.61.158
// @connect 10.6.61.219
// @connect 10.6.61.145
// @connect 10.6.61.141
// @connect 10.6.61.216
// @connect 10.6.61.143
// @connect 10.6.61.161
// @connect 10.6.61.229
// @connect 10.6.61.198
// @connect 10.6.61.160
// @connect 10.6.61.135
// @connect 10.6.61.205
// @connect 10.6.61.156
// @connect 10.6.61.159
// @connect 10.6.61.163
// @connect 10.6.61.203
// @connect 10.6.61.147
// @connect 10.6.61.136
// @connect 10.6.41.159
// @connect 10.6.61.231
// @connect 10.6.61.221
// @connect 10.6.61.142
// @connect 10.6.61.144
// @connect 10.6.61.139
// @connect 10.6.61.204
// @connect 10.6.61.208
// @connect 10.6.61.197
// @connect 10.6.61.166
// @connect 10.6.61.164
// @connect 10.6.61.68
// @connect 10.6.61.195
// @connect 10.6.61.151
// @connect 10.6.61.168
// @connect 10.6.61.140
// @connect 10.6.61.207
// @connect 10.6.61.214
// @connect 10.6.61.152
// @connect 10.6.61.222
// @connect 10.6.61.149
// @connect 10.6.61.226
// @connect 10.6.61.206
// @connect 10.6.61.232
// @connect 10.6.65.62
// @connect 10.6.61.138
// @connect 10.6.61.194
// @connect 10.6.61.213
// @connect 10.6.62.19
// @connect 10.6.62.20
// @connect 10.6.62.25
// @connect 10.6.62.27
// @connect 10.6.62.6
// @connect 10.6.62.32
// @connect 10.6.62.18
// @connect 10.6.62.17
// @connect 10.6.62.5
// @connect 10.6.62.21
// @connect 10.6.62.29
// @connect 10.6.62.28
// @connect 10.6.62.10
// @connect 10.6.62.38
// @connect 10.6.62.14
// @connect 10.6.62.23
// @connect 10.6.62.33
// @connect 10.6.62.40
// @connect 10.6.62.2
// @connect 10.6.62.37
// @connect 10.6.62.13
// @connect 10.6.62.35
// @connect 10.6.61.196
// @connect 10.6.62.12
// @connect 10.6.62.16
// @connect 10.6.62.11
// @connect 10.6.62.15
// @connect 10.6.62.36
// @connect 10.6.62.31
// @connect 10.6.62.39
// @connect 10.6.62.30
// @connect 10.6.62.41
// @connect 10.6.62.3
// @connect 10.6.62.26
// @connect 10.6.62.7
// @connect 10.6.62.132
// @connect 10.6.62.82
// @connect 10.6.62.87
// @connect 10.6.62.134
// @connect 10.6.62.92
// @connect 10.6.62.156
// @connect 10.6.62.85
// @connect 10.6.62.67
// @connect 10.6.62.83
// @connect 10.6.62.104
// @connect 10.6.62.69
// @connect 10.6.62.90
// @connect 10.6.62.155
// @connect 10.6.62.149
// @connect 10.6.62.79
// @connect 10.6.62.152
// @connect 10.6.62.72
// @connect 10.6.62.102
// @connect 10.6.62.81
// @connect 10.6.62.167
// @connect 10.6.62.93
// @connect 10.6.62.162
// @connect 10.6.62.80
// @connect 10.6.62.139
// @connect 10.6.62.98
// @connect 10.6.62.71
// @connect 10.6.62.146
// @connect 10.6.62.136
// @connect 10.6.62.88
// @connect 10.6.62.103
// @connect 10.6.62.151
// @connect 10.6.62.147
// @connect 10.6.62.97
// @connect 10.6.62.100
// @connect 10.6.62.78
// @connect 10.6.62.159
// @connect 10.6.62.68
// @connect 10.6.62.138
// @connect 10.6.62.73
// @connect 10.6.62.74
// @connect 10.6.62.77
// @connect 10.6.62.75
// @connect 10.6.62.66
// @connect 10.6.62.95
// @connect 10.6.62.84
// @connect 10.6.62.142
// @connect 10.6.62.89
// @connect 10.6.62.70
// @connect 10.6.62.96
// @connect 10.6.62.101
// @connect 10.6.62.150
// @connect 10.6.62.163
// @connect 10.6.62.76
// @connect 10.6.62.91
// @connect 10.6.62.206
// @connect 10.6.62.169
// @connect 10.6.62.140
// @connect 10.6.63.5
// @connect 10.6.62.166
// @connect 10.6.41.195
// @connect 10.6.62.225
// @connect 10.6.63.20
// @connect 10.6.62.168
// @connect 10.6.63.11
// @connect 10.6.62.137
// @connect 10.6.41.213
// @connect 10.6.62.205
// @connect 10.6.62.229
// @connect 10.6.62.221
// @connect 10.6.63.34
// @connect 10.6.62.218
// @connect 10.6.62.194
// @connect 10.6.62.202
// @connect 10.6.62.160
// @connect 10.6.62.133
// @connect 10.6.63.32
// @connect 10.6.62.141
// @connect 10.6.62.211
// @connect 10.6.54.130
// @connect 10.6.62.195
// @connect 10.6.62.219
// @connect 10.6.63.10
// @connect 10.6.62.214
// @connect 10.6.62.207
// @connect 10.6.63.21
// @connect 10.6.63.4
// @connect 10.6.63.28
// @connect 10.6.63.31
// @connect 10.6.63.18
// @connect 10.6.63.2
// @connect 10.6.62.144
// @connect 10.6.62.216
// @connect 10.6.62.210
// @connect 10.6.62.197
// @connect 10.6.62.199
// @connect 10.6.63.38
// @connect 10.6.62.224
// @connect 10.6.63.27
// @connect 10.6.62.154
// @connect 10.6.63.40
// @connect 10.6.63.9
// @connect 10.6.63.26
// @connect 10.6.63.13
// @connect 10.6.62.198
// @connect 10.6.62.148
// @connect 10.6.62.130
// @connect 10.6.62.227
// @connect 10.6.62.213
// @connect 10.6.62.164
// @connect 10.6.63.6
// @connect 10.6.62.201
// @connect 10.6.63.14
// @connect 10.6.63.37
// @connect 10.6.62.230
// @connect 10.6.63.15
// @connect 10.6.63.3
// @connect 10.6.63.7
// @connect 10.6.63.30
// @connect 10.6.62.215
// @connect 10.6.63.12
// @connect 10.6.63.39
// @connect 10.6.62.228
// @connect 10.6.63.29
// @connect 10.6.62.231
// @connect 10.6.62.161
// @connect 10.6.62.196
// @connect 10.6.42.164
// @connect 10.6.63.33
// @connect 10.6.62.212
// @connect 10.6.62.204
// @connect 10.6.63.17
// @connect 10.6.63.25
// @connect 10.6.63.23
// @connect 10.6.62.200
// @connect 10.6.63.35
// @connect 10.6.63.41
// @connect 10.6.62.223
// @connect 10.6.62.232
// @connect 10.6.63.8
// @connect 10.6.62.209
// @connect 10.6.62.203
// @connect 10.6.62.217
// @connect 10.6.62.145
// @connect 10.6.62.153
// @connect 10.6.62.220
// @connect 10.6.62.226
// @connect 10.6.63.36
// @connect 10.6.63.68
// @connect 10.6.63.99
// @connect 10.6.63.89
// @connect 10.6.63.83
// @connect 10.6.63.81
// @connect 10.6.63.80
// @connect 10.6.63.87
// @connect 10.6.63.66
// @connect 10.6.63.78
// @connect 10.6.63.71
// @connect 10.6.63.90
// @connect 10.6.63.100
// @connect 10.6.63.74
// @connect 10.6.63.104
// @connect 10.6.63.86
// @connect 10.6.63.19
// @connect 10.6.63.72
// @connect 10.6.63.103
// @connect 10.6.63.77
// @connect 10.6.63.76
// @connect 10.6.63.88
// @connect 10.6.63.98
// @connect 10.6.63.97
// @connect 10.6.63.82
// @connect 10.6.63.85
// @connect 10.6.63.67
// @connect 10.6.63.75
// @connect 10.6.63.79
// @connect 10.6.63.73
// @connect 10.6.63.96
// @connect 10.6.41.147
// @connect 10.6.63.101
// @connect 10.6.63.91
// @connect 10.6.63.70
// @connect 10.6.63.95
// @connect 10.6.63.93
// @connect 10.6.63.102
// @connect 10.6.63.84
// @connect 10.6.63.69
// @connect 10.6.63.105
// @connect 10.6.33.10
// @connect 10.6.32.5
// @connect 10.6.32.40
// @connect 10.6.33.73
// @connect 10.6.32.148
// @connect 10.6.32.150
// @connect 10.6.32.36
// @connect 10.6.32.11
// @connect 10.6.32.18
// @connect 10.6.32.39
// @connect 10.6.33.4
// @connect 10.6.33.12
// @connect 10.6.32.210
// @connect 10.6.32.135
// @connect 10.6.32.229
// @connect 10.6.32.67
// @connect 10.6.32.91
// @connect 10.6.32.197
// @connect 10.6.32.105
// @connect 10.6.32.151
// @connect 10.6.33.8
// @connect 10.6.32.141
// @connect 10.6.32.143
// @connect 10.6.33.11
// @connect 10.6.32.35
// @connect 10.6.32.233
// @connect 10.6.32.202
// @connect 10.6.32.206
// @connect 10.6.32.201
// @connect 10.6.32.10
// @connect 10.6.32.89
// @connect 10.6.33.3
// @connect 10.6.32.70
// @connect 10.6.32.216
// @connect 10.6.32.92
// @connect 10.6.32.100
// @connect 10.6.32.194
// @connect 10.6.32.20
// @connect 10.6.32.87
// @connect 10.6.32.209
// @connect 10.6.32.217
// @connect 10.6.32.154
// @connect 10.6.32.97
// @connect 10.6.32.198
// @connect 10.6.32.159
// @connect 10.6.32.68
// @connect 10.6.32.161
// @connect 10.6.32.16
// @connect 10.6.32.66
// @connect 10.6.32.130
// @connect 10.6.32.215
// @connect 10.6.32.221
// @connect 10.6.32.138
// @connect 10.6.32.84
// @connect 10.6.32.74
// @connect 10.6.32.155
// @connect 10.6.32.153
// @connect 10.6.32.95
// @connect 10.6.32.204
// @connect 10.6.32.31
// @connect 10.6.32.147
// @connect 10.6.32.32
// @connect 10.6.32.205
// @connect 10.6.33.145
// @connect 10.6.32.93
// @connect 10.6.33.2
// @connect 10.6.33.5
// @connect 10.6.32.160
// @connect 10.6.32.19
// @connect 10.6.32.81
// @connect 10.6.32.167
// @connect 10.6.32.98
// @connect 10.6.32.25
// @connect 10.6.32.80
// @connect 10.6.32.73
// @connect 10.6.32.17
// @connect 10.6.32.166
// @connect 10.6.32.165
// @connect 10.6.32.195
// @connect 10.6.32.22
// @connect 10.6.33.6
// @connect 10.6.32.142
// @connect 10.6.32.101
// @connect 10.6.32.223
// @connect 10.6.32.71
// @connect 10.6.32.162
// @connect 10.6.32.102
// @connect 10.6.32.200
// @connect 10.6.32.140
// @connect 10.6.32.137
// @connect 10.6.32.218
// @connect 10.6.32.90
// @connect 10.6.32.77
// @connect 10.6.32.149
// @connect 10.6.32.99
// @connect 10.6.32.83
// @connect 10.6.33.41
// @connect 10.6.32.27
// @connect 10.6.33.9
// @connect 10.6.32.23
// @connect 10.6.32.213
// @connect 10.6.32.28
// @connect 10.6.32.144
// @connect 10.6.32.78
// @connect 10.6.32.21
// @connect 10.6.32.132
// @connect 10.6.32.34
// @connect 10.6.32.2
// @connect 10.6.32.199
// @connect 10.6.32.136
// @connect 10.6.32.208
// @connect 10.6.32.82
// @connect 10.6.32.207
// @connect 10.6.32.69
// @connect 10.6.32.4
// @connect 10.6.32.145
// @connect 10.6.32.220
// @connect 10.6.32.7
// @connect 10.6.32.9
// @connect 10.6.33.28
// @connect 10.6.32.3
// @connect 10.6.32.157
// @connect 10.6.32.214
// @connect 10.6.33.7
// @connect 10.6.32.8
// @connect 10.6.32.152
// @connect 10.6.32.104
// @connect 10.6.32.164
// @connect 10.6.32.72
// @connect 10.6.32.29
// @connect 10.6.32.139
// @connect 10.6.32.75
// @connect 10.6.32.232
// @connect 10.6.32.163
// @connect 10.6.32.30
// @connect 10.6.32.196
// @connect 10.6.32.33
// @connect 10.6.32.13
// @connect 10.6.32.12
// @connect 10.6.32.76
// @connect 10.6.32.133
// @connect 10.6.32.88
// @connect 10.6.32.86
// @connect 10.6.32.85
// @connect 10.6.32.134
// @connect 10.6.32.15
// @connect 10.6.32.79
// @connect 10.6.32.158
// @connect 10.6.32.6
// @connect 10.6.32.37
// @connect 10.6.32.24
// @connect 10.6.32.94
// @connect 10.6.33.38
// @connect 10.6.33.13
// @connect 10.6.32.228
// @connect 10.6.33.17
// @connect 10.6.33.204
// @connect 10.6.32.211
// @connect 10.6.33.82
// @connect 10.6.33.202
// @connect 10.6.33.208
// @connect 10.6.33.92
// @connect 10.6.33.224
// @connect 10.6.33.69
// @connect 10.6.33.139
// @connect 10.6.33.101
// @connect 10.6.33.103
// @connect 10.6.33.102
// @connect 10.6.33.133
// @connect 10.6.33.215
// @connect 10.6.33.26
// @connect 10.6.33.136
// @connect 10.6.33.222
// @connect 10.6.33.89
// @connect 10.6.33.67
// @connect 10.6.33.80
// @connect 10.6.33.76
// @connect 10.6.33.135
// @connect 10.6.33.142
// @connect 10.6.33.194
// @connect 10.6.33.97
// @connect 10.6.33.79
// @connect 10.6.33.130
// @connect 10.6.33.68
// @connect 10.6.33.205
// @connect 10.6.33.85
// @connect 10.6.32.231
// @connect 10.6.33.14
// @connect 10.6.33.166
// @connect 10.6.33.203
// @connect 10.6.33.90
// @connect 10.6.33.94
// @connect 10.6.33.151
// @connect 10.6.33.146
// @connect 10.6.33.31
// @connect 10.6.33.29
// @connect 10.6.33.225
// @connect 10.6.33.36
// @connect 10.6.32.230
// @connect 10.6.33.228
// @connect 10.6.33.163
// @connect 10.6.33.143
// @connect 10.6.33.19
// @connect 10.6.33.131
// @connect 10.6.33.39
// @connect 10.6.32.226
// @connect 10.6.33.218
// @connect 10.6.33.96
// @connect 10.6.33.81
// @connect 10.6.33.140
// @connect 10.6.33.160
// @connect 10.6.33.209
// @connect 10.6.33.223
// @connect 10.6.33.15
// @connect 10.6.33.229
// @connect 10.6.33.158
// @connect 10.6.33.87
// @connect 10.6.33.157
// @connect 10.6.41.201
// @connect 10.6.33.30
// @connect 10.6.33.196
// @connect 10.6.33.23
// @connect 10.6.33.27
// @connect 10.6.33.230
// @connect 10.6.33.134
// @connect 10.6.33.75
// @connect 10.6.33.34
// @connect 10.6.33.226
// @connect 10.6.33.210
// @connect 10.6.33.200
// @connect 10.6.33.216
// @connect 10.6.33.132
// @connect 10.6.33.231
// @connect 10.6.33.167
// @connect 10.6.33.98
// @connect 10.6.33.93
// @connect 10.6.33.197
// @connect 10.6.33.227
// @connect 10.6.33.159
// @connect 10.6.33.95
// @connect 10.6.33.18
// @connect 10.6.33.165
// @connect 10.6.33.162
// @connect 10.6.32.222
// @connect 10.6.33.168
// @connect 10.6.33.84
// @connect 10.6.33.221
// @connect 10.6.33.86
// @connect 10.6.33.21
// @connect 10.6.34.2
// @connect 10.6.33.32
// @connect 10.6.33.199
// @connect 10.6.33.217
// @connect 10.6.33.195
// @connect 10.6.33.74
// @connect 10.6.33.71
// @connect 10.6.33.152
// @connect 10.6.32.225
// @connect 10.6.33.91
// @connect 10.6.33.156
// @connect 10.6.34.3
// @connect 10.6.33.37
// @connect 10.6.33.220
// @connect 10.6.33.153
// @connect 10.6.16.41
// @connect 10.6.33.148
// @connect 10.6.33.219
// @connect 10.6.32.212
// @connect 10.6.33.154
// @connect 10.6.33.149
// @connect 10.6.33.161
// @connect 10.6.33.201
// @connect 10.6.33.144
// @connect 10.6.33.72
// @connect 10.6.33.137
// @connect 10.6.33.83
// @connect 10.6.33.40
// @connect 10.6.33.150
// @connect 10.6.33.35
// @connect 10.6.33.211
// @connect 10.6.33.155
// @connect 10.6.33.206
// @connect 10.6.34.4
// @connect 10.6.34.5
// @connect 10.6.33.25
// @connect 10.6.33.70
// @connect 10.6.33.141
// @connect 10.6.33.104
// @connect 10.6.33.100
// @connect 10.6.33.214
// @connect 10.6.33.66
// @connect 10.6.33.147
// @connect 10.6.33.99
// @connect 10.6.33.212
// @connect 10.6.33.78
// @connect 10.6.33.24
// @connect 10.6.33.20
// @connect 10.6.33.22
// @connect 10.6.33.138
// @connect 10.6.33.16
// @connect 10.6.33.213
// @connect 10.6.33.88
// @connect 10.6.33.207
// @connect 10.6.34.69
// @connect 10.6.34.17
// @connect 10.6.34.89
// @connect 10.6.34.92
// @connect 10.6.34.219
// @connect 10.6.34.21
// @connect 10.6.34.29
// @connect 10.6.34.26
// @connect 10.6.34.94
// @connect 10.6.34.22
// @connect 10.6.34.82
// @connect 10.6.34.25
// @connect 10.6.34.71
// @connect 10.6.34.16
// @connect 10.6.34.11
// @connect 10.6.34.67
// @connect 10.6.34.31
// @connect 10.6.34.23
// @connect 10.6.34.24
// @connect 10.6.34.83
// @connect 10.6.34.84
// @connect 10.6.34.14
// @connect 10.6.34.10
// @connect 10.6.34.32
// @connect 10.6.34.96
// @connect 10.6.34.73
// @connect 10.6.34.74
// @connect 10.6.34.18
// @connect 10.6.34.202
// @connect 10.6.34.34
// @connect 10.6.34.28
// @connect 10.6.34.85
// @connect 10.6.34.15
// @connect 10.6.34.30
// @connect 10.6.34.86
// @connect 10.6.34.27
// @connect 10.6.34.72
// @connect 10.6.34.76
// @connect 10.6.34.79
// @connect 10.6.34.37
// @connect 10.6.34.81
// @connect 10.6.34.7
// @connect 10.6.34.35
// @connect 10.6.34.6
// @connect 10.6.34.75
// @connect 10.6.32.106
// @connect 10.6.34.90
// @connect 10.6.34.36
// @connect 10.6.34.87
// @connect 10.6.34.33
// @connect 10.6.41.153
// @connect 10.6.34.198
// @connect 10.6.34.20
// @connect 10.6.34.68
// @connect 10.6.34.8
// @connect 10.6.34.9
// @connect 10.6.34.88
// @connect 10.6.34.19
// @connect 10.6.34.70
// @connect 10.6.34.78
// @connect 10.6.34.95
// @connect 10.6.34.77
// @connect 10.6.34.224
// @connect 10.6.35.2
// @connect 10.6.35.78
// @connect 10.6.34.223
// @connect 10.6.35.14
// @connect 10.6.35.15
// @connect 10.6.35.24
// @connect 10.6.34.201
// @connect 10.6.34.233
// @connect 10.6.35.103
// @connect 10.6.35.17
// @connect 10.6.34.221
// @connect 10.6.35.9
// @connect 10.6.35.35
// @connect 10.6.35.27
// @connect 10.6.34.200
// @connect 10.6.35.3
// @connect 10.6.35.33
// @connect 10.6.34.222
// @connect 10.6.35.76
// @connect 10.6.35.89
// @connect 10.6.35.32
// @connect 10.6.34.102
// @connect 10.6.35.6
// @connect 10.6.34.228
// @connect 10.6.35.81
// @connect 10.6.35.70
// @connect 10.6.35.25
// @connect 10.6.34.105
// @connect 10.6.34.216
// @connect 10.6.35.10
// @connect 10.6.35.21
// @connect 10.6.35.22
// @connect 10.6.35.72
// @connect 10.6.34.208
// @connect 10.6.35.39
// @connect 10.6.35.16
// @connect 10.6.35.30
// @connect 10.6.35.38
// @connect 10.6.35.98
// @connect 10.6.35.82
// @connect 10.6.34.230
// @connect 10.6.34.218
// @connect 10.6.35.8
// @connect 10.6.35.42
// @connect 10.6.35.84
// @connect 10.6.35.23
// @connect 10.6.35.97
// @connect 10.6.35.20
// @connect 10.6.34.210
// @connect 10.6.35.101
// @connect 10.6.34.225
// @connect 10.6.34.195
// @connect 10.6.35.85
// @connect 10.6.34.217
// @connect 10.6.35.11
// @connect 10.6.34.205
// @connect 10.6.34.204
// @connect 10.6.35.26
// @connect 10.6.35.12
// @connect 10.6.35.80
// @connect 10.6.34.214
// @connect 10.6.34.209
// @connect 10.6.35.66
// @connect 10.6.34.99
// @connect 10.6.34.203
// @connect 10.6.34.232
// @connect 10.6.34.100
// @connect 10.6.35.4
// @connect 10.6.35.96
// @connect 10.6.34.211
// @connect 10.6.34.212
// @connect 10.6.34.215
// @connect 10.6.35.71
// @connect 10.6.35.36
// @connect 10.6.35.86
// @connect 10.6.35.99
// @connect 10.6.35.79
// @connect 10.6.35.7
// @connect 10.6.34.231
// @connect 10.6.35.91
// @connect 10.6.35.19
// @connect 10.6.35.92
// @connect 10.6.35.73
// @connect 10.6.35.83
// @connect 10.6.35.13
// @connect 10.6.34.91
// @connect 10.6.34.226
// @connect 10.6.34.199
// @connect 10.6.35.74
// @connect 10.6.35.18
// @connect 10.6.34.103
// @connect 10.6.34.197
// @connect 10.6.35.95
// @connect 10.6.34.196
// @connect 10.6.35.40
// @connect 10.6.35.88
// @connect 10.6.35.77
// @connect 10.6.34.229
// @connect 10.6.35.102
// @connect 10.6.35.87
// @connect 10.6.35.100
// @connect 10.6.35.104
// @connect 10.6.35.67
// @connect 10.6.34.227
// @connect 10.6.34.101
// @connect 10.6.35.28
// @connect 10.6.34.213
// @connect 10.6.35.34
// @connect 10.6.35.69
// @connect 10.6.34.207
// @connect 10.6.35.90
// @connect 10.6.35.93
// @connect 10.6.35.94
// @connect 10.6.35.75
// @connect 10.6.32.96
// @connect 10.6.35.68
// @connect 10.6.35.31
// @connect 10.6.20.207
// @connect 10.6.20.208
// @connect 10.6.20.231
// @connect 10.6.20.209
// @connect 10.6.23.74
// @connect 10.6.23.70
// @connect 10.6.23.71
// @connect 10.6.23.31
// @connect 10.6.23.28
// @connect 10.6.20.226
// @connect 10.6.23.66
// @connect 10.6.20.228
// @connect 10.6.23.36
// @connect 10.6.20.211
// @connect 10.6.22.211
// @connect 10.6.23.100
// @connect 10.6.22.2
// @connect 10.6.23.69
// @connect 10.6.22.26
// @connect 10.6.20.223
// @connect 10.6.20.220
// @connect 10.6.23.77
// @connect 10.6.23.82
// @connect 10.6.23.83
// @connect 10.6.23.85
// @connect 10.6.23.87
// @connect 10.6.20.204
// @connect 10.6.20.219
// @connect 10.6.23.99
// @connect 10.6.20.195
// @connect 10.6.23.103
// @connect 10.6.23.26
// @connect 10.6.20.217
// @connect 10.6.22.20
// @connect 10.6.23.13
// @connect 10.6.23.80
// @connect 10.6.22.195
// @connect 10.6.22.21
// @connect 10.6.20.230
// @connect 10.6.22.11
// @connect 10.6.23.93
// @connect 10.6.23.89
// @connect 10.6.22.218
// @connect 10.6.20.216
// @connect 10.6.22.3
// @connect 10.6.20.210
// @connect 10.6.23.68
// @connect 10.6.23.67
// @connect 10.6.23.98
// @connect 10.6.22.41
// @connect 10.6.22.228
// @connect 10.6.22.221
// @connect 10.6.22.37
// @connect 10.6.22.203
// @connect 10.6.23.95
// @connect 10.6.23.20
// @connect 10.6.20.206
// @connect 10.6.20.199
// @connect 10.6.22.15
// @connect 10.6.22.231
// @connect 10.6.23.84
// @connect 10.6.22.7
// @connect 10.6.23.92
// @connect 10.6.20.194
// @connect 10.6.20.203
// @connect 10.6.23.21
// @connect 10.6.22.31
// @connect 10.6.22.194
// @connect 10.6.20.215
// @connect 10.6.22.205
// @connect 10.6.22.17
// @connect 10.6.22.227
// @connect 10.6.20.200
// @connect 10.6.23.79
// @connect 10.6.22.34
// @connect 10.6.20.213
// @connect 10.6.22.19
// @connect 10.6.22.18
// @connect 10.6.20.224
// @connect 10.6.23.5
// @connect 10.6.23.32
// @connect 10.6.23.7
// @connect 10.6.22.213
// @connect 10.6.23.33
// @connect 10.6.22.214
// @connect 10.6.22.35
// @connect 10.6.23.12
// @connect 10.6.23.17
// @connect 10.6.22.223
// @connect 10.6.23.90
// @connect 10.6.23.76
// @connect 10.6.23.38
// @connect 10.6.23.75
// @connect 10.6.23.27
// @connect 10.6.23.24
// @connect 10.6.22.33
// @connect 10.6.22.29
// @connect 10.6.22.209
// @connect 10.6.46.86
// @connect 10.6.22.196
// @connect 10.6.22.217
// @connect 10.6.22.225
// @connect 10.6.22.219
// @connect 10.6.22.23
// @connect 10.6.22.13
// @connect 10.6.22.32
// @connect 10.6.23.104
// @connect 10.6.20.198
// @connect 10.6.23.72
// @connect 10.6.20.205
// @connect 10.6.20.212
// @connect 10.6.22.220
// @connect 10.6.23.4
// @connect 10.6.22.10
// @connect 10.6.20.229
// @connect 10.6.22.27
// @connect 10.6.23.14
// @connect 10.6.23.40
// @connect 10.6.22.202
// @connect 10.6.22.22
// @connect 10.6.22.14
// @connect 10.6.20.201
// @connect 10.6.22.229
// @connect 10.6.20.197
// @connect 10.6.23.9
// @connect 10.6.23.10
// @connect 10.6.23.22
// @connect 10.6.22.39
// @connect 10.6.22.226
// @connect 10.6.22.8
// @connect 10.6.23.102
// @connect 10.6.23.91
// @connect 10.6.20.214
// @connect 10.6.23.78
// @connect 10.6.23.23
// @connect 10.6.22.197
// @connect 10.6.22.5
// @connect 10.6.23.6
// @connect 10.6.22.25
// @connect 10.6.23.37
// @connect 10.6.22.6
// @connect 10.6.20.227
// @connect 10.6.22.200
// @connect 10.6.22.206
// @connect 10.6.20.225
// @connect 10.6.23.35
// @connect 10.6.22.198
// @connect 10.6.22.36
// @connect 10.6.23.2
// @connect 10.6.22.232
// @connect 10.6.22.12
// @connect 10.6.23.101
// @connect 10.6.23.94
// @connect 10.6.22.210
// @connect 10.6.23.97
// @connect 10.6.20.196
// @connect 10.6.23.96
// @connect 10.6.22.9
// @connect 10.6.22.208
// @connect 10.6.20.218
// @connect 10.6.22.30
// @connect 10.6.22.201
// @connect 10.6.22.199
// @connect 10.6.22.212
// @connect 10.6.23.81
// @connect 10.6.22.215
// @connect 10.6.23.18
// @connect 10.6.23.16
// @connect 10.6.23.39
// @connect 10.6.23.15
// @connect 10.6.23.19
// @connect 10.6.42.36
// @connect 10.6.22.230
// @connect 10.6.23.25
// @connect 10.6.22.16
// @connect 10.6.20.221
// @connect 10.6.22.4
// @connect 10.6.23.8
// @connect 10.6.20.202
// @connect 10.6.22.40
// @connect 10.6.22.204
// @connect 10.6.23.86
// @connect 10.6.22.207
// @connect 10.6.20.134
// @connect 10.6.20.143
// @connect 10.6.23.105
// @connect 10.6.20.142
// @connect 10.6.20.144
// @connect 10.6.20.150
// @connect 10.6.20.137
// @connect 10.6.20.136
// @connect 10.6.20.135
// @connect 10.6.20.138
// @connect 10.6.20.140
// @connect 10.6.20.131
// @connect 10.6.20.148
// @connect 10.6.20.139
// @connect 10.6.20.130
// @connect 10.6.20.146
// @connect 10.6.20.232
// @connect 10.6.20.151
// @connect 10.6.20.152
// @connect 10.6.20.149
// @connect 10.6.20.147
// @connect 10.6.20.132
// @connect 10.6.20.133
// @connect 10.6.21.145
// @connect 10.6.21.147
// @connect 10.6.21.167
// @connect 10.6.22.76
// @connect 10.6.21.152
// @connect 10.6.21.151
// @connect 10.6.21.159
// @connect 10.6.21.166
// @connect 10.6.21.156
// @connect 10.6.21.139
// @connect 10.6.21.150
// @connect 10.6.21.161
// @connect 10.6.21.157
// @connect 10.6.21.136
// @connect 10.6.21.144
// @connect 10.6.21.153
// @connect 10.6.22.68
// @connect 10.6.21.163
// @connect 10.6.21.73
// @connect 10.6.21.69
// @connect 10.6.22.71
// @connect 10.6.22.77
// @connect 10.6.22.75
// @connect 10.6.21.165
// @connect 10.6.22.73
// @connect 10.6.21.146
// @connect 10.6.21.148
// @connect 10.6.22.81
// @connect 10.6.21.71
// @connect 10.6.21.143
// @connect 10.6.20.153
// @connect 10.6.22.74
// @connect 10.6.21.72
// @connect 10.6.21.155
// @connect 10.6.22.79
// @connect 10.6.21.67
// @connect 10.6.21.66
// @connect 10.6.21.142
// @connect 10.6.21.154
// @connect 10.6.22.72
// @connect 10.6.21.68
// @connect 10.6.22.80
// @connect 10.6.22.67
// @connect 10.6.21.140
// @connect 10.6.22.78
// @connect 10.6.21.162
// @connect 10.6.21.141
// @connect 10.6.21.160
// @connect 10.6.21.149
// @connect 10.6.28.32
// @connect 10.6.22.70
// @connect 10.6.21.158
// @connect 10.6.22.69
// @connect 10.6.33.169
// @connect 10.6.32.168
// @connect 10.6.23.29
// @connect 10.6.32.41
// @connect 10.6.34.135
// @connect 10.6.34.165
// @connect 10.6.34.130
// @connect 10.6.34.134
// @connect 10.6.34.150
// @connect 10.6.34.138
// @connect 10.6.34.142
// @connect 10.6.34.145
// @connect 10.6.34.152
// @connect 10.6.34.155
// @connect 10.6.34.132
// @connect 10.6.34.147
// @connect 10.6.34.158
// @connect 10.6.34.133
// @connect 10.6.34.143
// @connect 10.6.34.162
// @connect 10.6.34.146
// @connect 10.6.34.151
// @connect 10.6.34.167
// @connect 10.6.34.137
// @connect 10.6.34.160
// @connect 10.6.34.131
// @connect 10.6.34.144
// @connect 10.6.34.149
// @connect 10.6.34.168
// @connect 10.6.34.157
// @connect 10.6.34.164
// @connect 10.6.34.136
// @connect 10.6.34.148
// @connect 10.6.34.159
// @connect 10.6.34.154
// @connect 10.6.34.140
// @connect 10.6.34.161
// @connect 10.6.34.156
// @connect 10.6.34.166
// @connect 10.6.34.153
// @connect 10.6.34.163
// @connect 10.6.34.141
// @connect 10.6.34.139
// @connect 10.6.32.169
// @connect 10.6.22.233
// @connect 10.6.21.168
// @connect 10.6.52.169
// @connect 10.6.54.40
// @connect 10.6.54.39
// @connect 10.6.52.168
// @connect 10.6.65.115
// @connect 10.6.66.50
// @connect 10.6.61.88
// @connect 10.6.62.4
// @connect 10.6.59.100
// @connect 10.6.57.133
// @connect 10.6.56.87
// @connect 10.6.57.99
// @connect 10.6.56.92
// @connect 10.6.53.166
// @connect 10.6.53.167
// @connect 10.6.53.169
// @connect 10.6.53.39
// @connect 10.6.53.41
// @connect 10.6.53.40
// @connect 10.6.52.41
// @connect 10.6.73.202
// @connect 10.6.73.255
// @connect 10.6.45.95
// @connect 10.6.44.159
// @connect 10.6.46.13
// @connect 10.6.40.232
// @connect 10.6.74.45
// @connect 10.6.33.105
// @connect 10.6.32.203
// @connect 10.6.34.169
// @connect 10.6.35.105
// @connect 10.6.35.5
// @connect 10.6.74.46
// @connect 10.6.74.51
// @connect 10.6.74.52
// @connect 10.6.70.52
// @connect 10.6.62.9
// @connect 10.6.64.255
// @connect 10.6.68.247
// @connect 10.6.69.63
// @connect 10.6.70.54
// @connect 10.6.70.55
// @connect 10.6.74.53
// @connect 10.6.74.54
// @connect 10.6.28.169
// @connect 10.6.44.169
// @connect 10.6.1.66
// @connect 10.6.1.74
// @connect 10.6.1.40
// @connect 10.6.0.229
// @connect 10.6.1.20
// @connect 10.6.1.87
// @connect 10.6.0.226
// @connect 10.6.1.95
// @connect 10.6.1.77
// @connect 10.6.1.98
// @connect 10.6.0.214
// @connect 10.6.0.199
// @connect 10.6.1.22
// @connect 10.6.1.16
// @connect 10.6.1.96
// @connect 10.6.1.79
// @connect 10.6.0.209
// @connect 10.6.1.8
// @connect 10.6.1.17
// @connect 10.6.0.200
// @connect 10.6.1.2
// @connect 10.6.1.75
// @connect 10.6.0.220
// @connect 10.6.1.103
// @connect 10.6.1.105
// @connect 10.6.1.83
// @connect 10.6.1.99
// @connect 10.6.1.70
// @connect 10.6.1.81
// @connect 10.6.1.31
// @connect 10.6.0.194
// @connect 10.6.1.30
// @connect 10.6.1.93
// @connect 10.6.0.230
// @connect 10.6.0.213
// @connect 10.6.0.212
// @connect 10.6.1.6
// @connect 10.6.1.14
// @connect 10.6.0.203
// @connect 10.6.1.32
// @connect 10.6.0.232
// @connect 10.6.1.41
// @connect 10.6.1.86
// @connect 10.6.1.90
// @connect 10.6.1.80
// @connect 10.6.1.88
// @connect 10.6.1.7
// @connect 10.6.0.206
// @connect 10.6.1.73
// @connect 10.6.0.207
// @connect 10.6.0.216
// @connect 10.6.1.69
// @connect 10.6.1.84
// @connect 10.6.0.228
// @connect 10.6.0.201
// @connect 10.6.0.225
// @connect 10.6.0.195
// @connect 10.6.1.28
// @connect 10.6.1.89
// @connect 10.6.1.12
// @connect 10.6.1.82
// @connect 10.6.0.202
// @connect 10.6.1.5
// @connect 10.6.1.100
// @connect 10.6.1.25
// @connect 10.6.1.68
// @connect 10.6.0.215
// @connect 10.6.1.27
// @connect 10.6.1.23
// @connect 10.6.0.211
// @connect 10.6.1.91
// @connect 10.6.0.133
// @connect 10.6.0.233
// @connect 10.6.1.24
// @connect 10.6.1.4
// @connect 10.6.1.97
// @connect 10.6.1.76
// @connect 10.6.0.221
// @connect 10.6.0.210
// @connect 10.6.1.101
// @connect 10.6.0.208
// @connect 10.6.1.85
// @connect 10.6.0.205
// @connect 10.6.1.13
// @connect 10.6.1.102
// @connect 10.6.1.21
// @connect 10.6.1.33
// @connect 10.6.0.217
// @connect 10.6.1.10
// @connect 10.6.1.92
// @connect 10.6.0.219
// @connect 10.6.1.18
// @connect 10.6.1.72
// @connect 10.6.0.197
// @connect 10.6.0.218
// @connect 10.6.1.19
// @connect 10.6.1.71
// @connect 10.6.1.15
// @connect 10.6.0.204
// @connect 10.6.1.38
// @connect 10.6.0.231
// @connect 10.6.1.78
// @connect 10.6.0.223
// @connect 10.6.0.198
// @connect 10.6.1.26
// @connect 10.6.1.37
// @connect 10.6.1.36
// @connect 10.6.1.67
// @connect 10.6.1.11
// @connect 10.6.0.224
// @connect 10.6.0.132
// @connect 10.6.1.9
// @connect 10.6.0.130
// @connect 10.6.0.222
// @connect 10.6.1.34
// @connect 10.6.1.29
// @connect 10.6.0.227
// @connect 10.6.1.35
// @connect 10.6.1.104
// @connect 10.6.1.138
// @connect 10.6.2.89
// @connect 10.6.1.163
// @connect 10.6.2.162
// @connect 10.6.3.36
// @connect 10.6.2.99
// @connect 10.6.3.30
// @connect 10.6.3.7
// @connect 10.6.1.213
// @connect 10.6.2.90
// @connect 10.6.3.34
// @connect 10.6.1.205
// @connect 10.6.2.137
// @connect 10.6.1.157
// @connect 10.6.2.41
// @connect 10.6.3.15
// @connect 10.6.2.165
// @connect 10.6.3.40
// @connect 10.6.2.138
// @connect 10.6.1.196
// @connect 10.6.3.37
// @connect 10.6.2.132
// @connect 10.6.2.71
// @connect 10.6.2.146
// @connect 10.6.3.31
// @connect 10.6.2.100
// @connect 10.6.1.165
// @connect 10.6.1.216
// @connect 10.6.3.28
// @connect 10.6.3.41
// @connect 10.6.2.92
// @connect 10.6.2.77
// @connect 10.6.2.104
// @connect 10.6.3.23
// @connect 10.6.2.154
// @connect 10.6.3.14
// @connect 10.6.2.164
// @connect 10.6.3.75
// @connect 10.6.2.66
// @connect 10.6.2.38
// @connect 10.6.1.167
// @connect 10.6.2.147
// @connect 10.6.2.161
// @connect 10.6.1.202
// @connect 10.6.2.130
// @connect 10.6.3.5
// @connect 10.6.2.149
// @connect 10.6.1.142
// @connect 10.6.2.87
// @connect 10.6.2.101
// @connect 10.6.2.31
// @connect 10.6.2.140
// @connect 10.6.2.158
// @connect 10.6.3.26
// @connect 10.6.2.98
// @connect 10.6.2.148
// @connect 10.6.1.140
// @connect 10.6.3.22
// @connect 10.6.2.153
// @connect 10.6.2.16
// @connect 10.6.2.159
// @connect 10.6.2.79
// @connect 10.6.2.91
// @connect 10.6.2.88
// @connect 10.6.2.169
// @connect 10.6.2.155
// @connect 10.6.1.228
// @connect 10.6.2.95
// @connect 10.6.3.4
// @connect 10.6.1.195
// @connect 10.6.2.156
// @connect 10.6.3.3
// @connect 10.6.3.66
// @connect 10.6.2.96
// @connect 10.6.2.133
// @connect 10.6.3.67
// @connect 10.6.2.86
// @connect 10.6.2.81
// @connect 10.6.3.27
// @connect 10.6.1.148
// @connect 10.6.3.12
// @connect 10.6.2.82
// @connect 10.6.3.83
// @connect 10.6.2.144
// @connect 10.6.2.74
// @connect 10.6.1.220
// @connect 10.6.1.232
// @connect 10.6.1.159
// @connect 10.6.2.167
// @connect 10.6.3.18
// @connect 10.6.2.102
// @connect 10.6.2.143
// @connect 10.6.3.21
// @connect 10.6.3.35
// @connect 10.6.1.215
// @connect 10.6.1.133
// @connect 10.6.3.32
// @connect 10.6.1.151
// @connect 10.6.1.146
// @connect 10.6.1.144
// @connect 10.6.3.25
// @connect 10.6.1.227
// @connect 10.6.3.19
// @connect 10.6.1.134
// @connect 10.6.1.170
// @connect 10.6.3.11
// @connect 10.6.3.6
// @connect 10.6.3.39
// @connect 10.6.2.141
// @connect 10.6.1.214
// @connect 10.6.1.152
// @connect 10.6.2.11
// @connect 10.6.1.137
// @connect 10.6.1.221
// @connect 10.6.2.36
// @connect 10.6.1.211
// @connect 10.6.3.29
// @connect 10.6.1.225
// @connect 10.6.1.147
// @connect 10.6.3.2
// @connect 10.6.2.93
// @connect 10.6.2.168
// @connect 10.6.1.145
// @connect 10.6.2.85
// @connect 10.6.2.151
// @connect 10.6.3.70
// @connect 10.6.1.230
// @connect 10.6.1.198
// @connect 10.6.3.13
// @connect 10.6.2.15
// @connect 10.6.1.153
// @connect 10.6.1.210
// @connect 10.6.2.2
// @connect 10.6.2.150
// @connect 10.6.1.194
// @connect 10.6.2.73
// @connect 10.6.1.219
// @connect 10.6.2.97
// @connect 10.6.2.35
// @connect 10.6.2.135
// @connect 10.6.1.231
// @connect 10.6.1.226
// @connect 10.6.2.134
// @connect 10.6.1.218
// @connect 10.6.2.4
// @connect 10.6.1.164
// @connect 10.6.2.94
// @connect 10.6.2.20
// @connect 10.6.3.71
// @connect 10.6.1.135
// @connect 10.6.1.233
// @connect 10.6.2.28
// @connect 10.6.1.212
// @connect 10.6.3.9
// @connect 10.6.2.163
// @connect 10.6.2.12
// @connect 10.6.1.197
// @connect 10.6.2.80
// @connect 10.6.2.8
// @connect 10.6.2.83
// @connect 10.6.2.131
// @connect 10.6.1.150
// @connect 10.6.2.10
// @connect 10.6.1.204
// @connect 10.6.2.160
// @connect 10.6.1.143
// @connect 10.6.2.30
// @connect 10.6.2.103
// @connect 10.6.1.199
// @connect 10.6.2.21
// @connect 10.6.2.14
// @connect 10.6.3.20
// @connect 10.6.3.24
// @connect 10.6.3.68
// @connect 10.6.2.3
// @connect 10.6.2.139
// @connect 10.6.3.38
// @connect 10.6.2.105
// @connect 10.6.3.10
// @connect 10.6.2.157
// @connect 10.6.1.166
// @connect 10.6.2.39
// @connect 10.6.3.8
// @connect 10.6.1.209
// @connect 10.6.1.207
// @connect 10.6.1.149
// @connect 10.6.2.13
// @connect 10.6.1.131
// @connect 10.6.1.224
// @connect 10.6.1.229
// @connect 10.6.1.168
// @connect 10.6.1.154
// @connect 10.6.2.6
// @connect 10.6.2.34
// @connect 10.6.1.132
// @connect 10.6.2.72
// @connect 10.6.1.208
// @connect 10.6.3.33
// @connect 10.6.2.5
// @connect 10.6.2.75
// @connect 10.6.3.69
// @connect 10.6.2.33
// @connect 10.6.1.201
// @connect 10.6.1.160
// @connect 10.6.2.9
// @connect 10.6.2.25
// @connect 10.6.1.136
// @connect 10.6.2.70
// @connect 10.6.2.40
// @connect 10.6.1.222
// @connect 10.6.2.26
// @connect 10.6.1.200
// @connect 10.6.2.17
// @connect 10.6.2.136
// @connect 10.6.1.223
// @connect 10.6.1.141
// @connect 10.6.2.152
// @connect 10.6.3.17
// @connect 10.6.1.206
// @connect 10.6.1.162
// @connect 10.6.2.67
// @connect 10.6.1.203
// @connect 10.6.2.24
// @connect 10.6.1.158
// @connect 10.6.2.29
// @connect 10.6.1.217
// @connect 10.6.2.37
// @connect 10.6.2.76
// @connect 10.6.2.32
// @connect 10.6.1.155
// @connect 10.6.1.156
// @connect 10.6.1.169
// @connect 10.6.2.142
// @connect 10.6.3.103
// @connect 10.6.21.233
// @connect 10.6.21.20
// @connect 10.6.20.41
// @connect 10.6.20.99
// @connect 10.6.20.105
// @connect 10.6.20.26
// @connect 10.6.20.67
// @connect 10.6.20.22
// @connect 10.6.20.20
// @connect 10.6.20.32
// @connect 10.6.21.220
// @connect 10.6.21.132
// @connect 10.6.2.225
// @connect 10.6.22.138
// @connect 10.6.22.143
// @connect 10.6.21.230
// @connect 10.6.21.98
// @connect 10.6.21.212
// @connect 10.6.21.29
// @connect 10.6.20.15
// @connect 10.6.22.159
// @connect 10.6.21.137
// @connect 10.6.20.13
// @connect 10.6.22.150
// @connect 10.6.3.88
// @connect 10.6.22.158
// @connect 10.6.3.87
// @connect 10.6.21.78
// @connect 10.6.2.224
// @connect 10.6.2.226
// @connect 10.6.22.90
// @connect 10.6.20.31
// @connect 10.6.20.98
// @connect 10.6.22.103
// @connect 10.6.20.161
// @connect 10.6.20.95
// @connect 10.6.20.160
// @connect 10.6.20.164
// @connect 10.6.21.202
// @connect 10.6.21.19
// @connect 10.6.20.27
// @connect 10.6.3.72
// @connect 10.6.3.105
// @connect 10.6.3.85
// @connect 10.6.21.22
// @connect 10.6.20.34
// @connect 10.6.22.134
// @connect 10.6.21.214
// @connect 10.6.21.26
// @connect 10.6.22.100
// @connect 10.6.20.157
// @connect 10.6.22.105
// @connect 10.6.21.83
// @connect 10.6.21.30
// @connect 10.6.20.33
// @connect 10.6.21.131
// @connect 10.6.2.207
// @connect 10.6.22.142
// @connect 10.6.21.41
// @connect 10.6.3.93
// @connect 10.6.21.104
// @connect 10.6.21.14
// @connect 10.6.21.208
// @connect 10.6.3.98
// @connect 10.6.34.98
// @connect 10.6.21.6
// @connect 10.6.22.87
// @connect 10.6.2.231
// @connect 10.6.20.85
// @connect 10.6.21.27
// @connect 10.6.21.216
// @connect 10.6.21.97
// @connect 10.6.20.88
// @connect 10.6.21.201
// @connect 10.6.22.95
// @connect 10.6.21.222
// @connect 10.6.21.213
// @connect 10.6.22.146
// @connect 10.6.20.12
// @connect 10.6.20.35
// @connect 10.6.2.198
// @connect 10.6.20.6
// @connect 10.6.20.163
// @connect 10.6.20.100
// @connect 10.6.21.25
// @connect 10.6.21.37
// @connect 10.6.22.135
// @connect 10.6.22.94
// @connect 10.6.2.214
// @connect 10.6.21.95
// @connect 10.6.22.139
// @connect 10.6.3.86
// @connect 10.6.21.31
// @connect 10.6.2.196
// @connect 10.6.2.194
// @connect 10.6.21.87
// @connect 10.6.21.16
// @connect 10.6.21.229
// @connect 10.6.20.14
// @connect 10.6.21.227
// @connect 10.6.3.81
// @connect 10.6.20.9
// @connect 10.6.20.96
// @connect 10.6.3.101
// @connect 10.6.3.78
// @connect 10.6.22.101
// @connect 10.6.21.21
// @connect 10.6.21.199
// @connect 10.6.2.201
// @connect 10.6.20.3
// @connect 10.6.20.69
// @connect 10.6.20.94
// @connect 10.6.21.103
// @connect 10.6.21.34
// @connect 10.6.21.35
// @connect 10.6.21.8
// @connect 10.6.20.101
// @connect 10.6.22.157
// @connect 10.6.20.29
// @connect 10.6.21.215
// @connect 10.6.21.94
// @connect 10.6.20.79
// @connect 10.6.21.225
// @connect 10.6.20.23
// @connect 10.6.21.135
// @connect 10.6.21.23
// @connect 10.6.2.205
// @connect 10.6.3.90
// @connect 10.6.21.101
// @connect 10.6.21.134
// @connect 10.6.3.97
// @connect 10.6.21.138
// @connect 10.6.3.74
// @connect 10.6.22.132
// @connect 10.6.21.105
// @connect 10.6.22.102
// @connect 10.6.21.12
// @connect 10.6.20.82
// @connect 10.6.20.156
// @connect 10.6.21.209
// @connect 10.6.21.219
// @connect 10.6.3.73
// @connect 10.6.20.90
// @connect 10.6.22.99
// @connect 10.6.21.217
// @connect 10.6.3.84
// @connect 10.6.2.200
// @connect 10.6.2.228
// @connect 10.6.2.212
// @connect 10.6.22.155
// @connect 10.6.22.84
// @connect 10.6.22.165
// @connect 10.6.20.25
// @connect 10.6.2.223
// @connect 10.6.21.86
// @connect 10.6.21.17
// @connect 10.6.20.87
// @connect 10.6.21.100
// @connect 10.6.20.10
// @connect 10.6.21.13
// @connect 10.6.22.104
// @connect 10.6.3.82
// @connect 10.6.21.130
// @connect 10.6.22.154
// @connect 10.6.2.221
// @connect 10.6.21.133
// @connect 10.6.22.144
// @connect 10.6.21.7
// @connect 10.6.20.76
// @connect 10.6.3.96
// @connect 10.6.20.24
// @connect 10.6.2.216
// @connect 10.6.2.213
// @connect 10.6.2.220
// @connect 10.6.21.228
// @connect 10.6.21.38
// @connect 10.6.21.198
// @connect 10.6.21.203
// @connect 10.6.22.137
// @connect 10.6.21.221
// @connect 10.6.2.203
// @connect 10.6.22.161
// @connect 10.6.21.90
// @connect 10.6.21.82
// @connect 10.6.20.2
// @connect 10.6.0.169
// @connect 10.6.21.226
// @connect 10.6.21.93
// @connect 10.6.22.136
// @connect 10.6.21.36
// @connect 10.6.20.167
// @connect 10.6.22.89
// @connect 10.6.20.66
// @connect 10.6.21.207
// @connect 10.6.21.81
// @connect 10.6.22.148
// @connect 10.6.21.92
// @connect 10.6.22.156
// @connect 10.6.2.202
// @connect 10.6.2.227
// @connect 10.6.20.93
// @connect 10.6.21.2
// @connect 10.6.21.99
// @connect 10.6.20.155
// @connect 10.6.22.140
// @connect 10.6.2.206
// @connect 10.6.3.94
// @connect 10.6.20.159
// @connect 10.6.22.88
// @connect 10.6.22.85
// @connect 10.6.21.10
// @connect 10.6.20.11
// @connect 10.6.3.76
// @connect 10.6.22.160
// @connect 10.6.21.102
// @connect 10.6.22.153
// @connect 10.6.20.39
// @connect 10.6.21.205
// @connect 10.6.20.7
// @connect 10.6.21.18
// @connect 10.6.20.92
// @connect 10.6.2.199
// @connect 10.6.2.197
// @connect 10.6.20.162
// @connect 10.6.20.73
// @connect 10.6.21.3
// @connect 10.6.2.210
// @connect 10.6.3.79
// @connect 10.6.21.194
// @connect 10.6.2.211
// @connect 10.6.20.166
// @connect 10.6.21.80
// @connect 10.6.2.232
// @connect 10.6.20.89
// @connect 10.6.21.77
// @connect 10.6.21.32
// @connect 10.6.20.84
// @connect 10.6.2.233
// @connect 10.6.20.80
// @connect 10.6.3.91
// @connect 10.6.20.68
// @connect 10.6.3.80
// @connect 10.6.22.152
// @connect 10.6.22.168
// @connect 10.6.41.165
// @connect 10.6.20.104
// @connect 10.6.2.217
// @connect 10.6.3.77
// @connect 10.6.22.86
// @connect 10.6.20.145
// @connect 10.6.21.206
// @connect 10.6.2.195
// @connect 10.6.20.102
// @connect 10.6.20.91
// @connect 10.6.2.209
// @connect 10.6.20.71
// @connect 10.6.21.33
// @connect 10.6.21.196
// @connect 10.6.20.38
// @connect 10.6.3.100
// @connect 10.6.20.158
// @connect 10.6.20.4
// @connect 10.6.22.151
// @connect 10.6.20.8
// @connect 10.6.21.204
// @connect 10.6.22.93
// @connect 10.6.20.36
// @connect 10.6.21.24
// @connect 10.6.21.85
// @connect 10.6.2.229
// @connect 10.6.21.40
// @connect 10.6.22.83
// @connect 10.6.20.103
// @connect 10.6.20.77
// @connect 10.6.21.195
// @connect 10.6.22.92
// @connect 10.6.2.208
// @connect 10.6.22.149
// @connect 10.6.20.18
// @connect 10.6.3.89
// @connect 10.6.21.211
// @connect 10.6.21.218
// @connect 10.6.2.215
// @connect 10.6.2.230
// @connect 10.6.22.91
// @connect 10.6.20.86
// @connect 10.6.20.168
// @connect 10.6.2.204
// @connect 10.6.21.84
// @connect 10.6.22.82
// @connect 10.6.21.197
// @connect 10.6.20.83
// @connect 10.6.21.88
// @connect 10.6.21.232
// @connect 10.6.22.130
// @connect 10.6.22.133
// @connect 10.6.22.141
// @connect 10.6.20.37
// @connect 10.6.21.223
// @connect 10.6.21.11
// @connect 10.6.14.106
// @connect 10.6.22.98
// @connect 10.6.21.200
// @connect 10.6.20.19
// @connect 10.6.3.95
// @connect 10.6.22.97
// @connect 10.6.20.165
// @connect 10.6.21.70
// @connect 10.6.20.70
// @connect 10.6.3.102
// @connect 10.6.22.96
// @connect 10.6.20.78
// @connect 10.6.22.131
// @connect 10.6.3.92
// @connect 10.6.22.162
// @connect 10.6.21.15
// @connect 10.6.21.89
// @connect 10.6.2.218
// @connect 10.6.22.166
// @connect 10.6.20.154
// @connect 10.6.20.21
// @connect 10.6.22.163
// @connect 10.6.20.17
// @connect 10.6.21.28
// @connect 10.6.22.164
// @connect 10.6.22.145
// @connect 10.6.21.5
// @connect 10.6.2.222
// @connect 10.6.21.4
// @connect 10.6.20.81
// @connect 10.6.21.210
// @connect 10.6.20.28
// @connect 10.6.3.99
// @connect 10.6.20.72
// @connect 10.6.22.147
// @connect 10.6.3.104
// @connect 10.6.21.224
// @connect 10.6.20.74
// @connect 10.6.21.79
// @connect 10.6.20.97
// @connect 10.6.20.30
// @connect 10.6.22.167
// @connect 10.6.20.40
// @connect 10.6.2.78
// @connect 10.6.0.96
// @connect 10.6.0.68
// @connect 10.6.0.159
// @connect 10.6.0.162
// @connect 10.6.0.73
// @connect 10.6.12.35
// @connect 10.6.0.11
// @connect 10.6.0.106
// @connect 10.6.1.161
// @connect 10.6.0.15
// @connect 10.6.0.97
// @connect 10.6.0.7
// @connect 10.6.0.154
// @connect 10.6.0.69
// @connect 10.6.0.75
// @connect 10.6.0.141
// @connect 10.6.0.163
// @connect 10.6.0.92
// @connect 10.6.0.38
// @connect 10.6.0.79
// @connect 10.6.0.98
// @connect 10.6.0.152
// @connect 10.6.0.20
// @connect 10.6.0.35
// @connect 10.6.0.3
// @connect 10.6.0.82
// @connect 10.6.0.25
// @connect 10.6.0.135
// @connect 10.6.0.93
// @connect 10.6.0.13
// @connect 10.6.0.30
// @connect 10.6.0.2
// @connect 10.6.0.101
// @connect 10.6.0.168
// @connect 10.6.0.161
// @connect 10.6.0.14
// @connect 10.6.0.40
// @connect 10.6.0.21
// @connect 10.6.0.148
// @connect 10.6.0.12
// @connect 10.6.0.89
// @connect 10.6.0.10
// @connect 10.6.0.5
// @connect 10.6.0.9
// @connect 10.6.0.83
// @connect 10.6.0.142
// @connect 10.6.0.17
// @connect 10.6.0.95
// @connect 10.6.0.72
// @connect 10.6.0.137
// @connect 10.6.0.167
// @connect 10.6.0.67
// @connect 10.6.0.84
// @connect 10.6.0.26
// @connect 10.6.0.85
// @connect 10.6.0.77
// @connect 10.6.0.39
// @connect 10.6.0.94
// @connect 10.6.0.37
// @connect 10.6.0.22
// @connect 10.6.0.76
// @connect 10.6.0.157
// @connect 10.6.0.139
// @connect 10.6.0.102
// @connect 10.6.0.165
// @connect 10.6.0.19
// @connect 10.6.0.4
// @connect 10.6.0.155
// @connect 10.6.0.131
// @connect 10.6.0.29
// @connect 10.6.0.33
// @connect 10.6.0.16
// @connect 10.6.0.91
// @connect 10.6.0.27
// @connect 10.6.0.103
// @connect 10.6.0.156
// @connect 10.6.0.99
// @connect 10.6.0.81
// @connect 10.6.0.6
// @connect 10.6.0.105
// @connect 10.6.0.104
// @connect 10.6.0.18
// @connect 10.6.0.70
// @connect 10.6.0.164
// @connect 10.6.0.34
// @connect 10.6.0.149
// @connect 10.6.44.231
// @connect 10.6.0.28
// @connect 10.6.0.8
// @connect 10.6.0.80
// @connect 10.6.0.153
// @connect 10.6.0.23
// @connect 10.6.0.71
// @connect 10.6.0.100
// @connect 10.6.0.166
// @connect 10.6.0.24
// @connect 10.6.0.32
// @connect 10.6.12.14
// @connect 10.6.0.78
// @connect 10.6.0.36
// @connect 10.6.0.158
// @connect 10.6.0.88
// @connect 10.6.0.87
// @connect 10.6.0.134
// @connect 10.6.0.86
// @connect 10.6.0.31
// @connect 10.6.0.136
// @connect 10.6.0.74
// @connect 10.6.12.17
// @connect 10.6.12.31
// @connect 10.6.12.20
// @connect 10.6.12.32
// @connect 10.6.12.5
// @connect 10.6.12.7
// @connect 10.6.12.29
// @connect 10.6.12.37
// @connect 10.6.12.21
// @connect 10.6.12.2
// @connect 10.6.12.23
// @connect 10.6.12.36
// @connect 10.6.12.34
// @connect 10.6.12.11
// @connect 10.6.12.15
// @connect 10.6.12.25
// @connect 10.6.12.40
// @connect 10.6.12.38
// @connect 10.6.12.4
// @connect 10.6.12.16
// @connect 10.6.12.68
// @connect 10.6.12.3
// @connect 10.6.12.12
// @connect 10.6.12.18
// @connect 10.6.12.27
// @connect 10.6.12.8
// @connect 10.6.12.41
// @connect 10.6.12.33
// @connect 10.6.12.6
// @connect 10.6.12.13
// @connect 10.6.12.24
// @connect 10.6.12.26
// @connect 10.6.12.30
// @connect 10.6.12.39
// @connect 10.6.12.67
// @connect 10.6.12.10
// @connect 10.6.12.28
// @connect 10.6.12.66
// @connect 10.6.12.19
// @connect 10.6.12.22
// @connect 10.6.12.9
// @connect 10.6.8.78
// @connect 10.6.8.230
// @connect 10.6.9.6
// @connect 10.6.9.11
// @connect 10.6.8.71
// @connect 10.6.8.101
// @connect 10.6.9.18
// @connect 10.6.8.97
// @connect 10.6.8.139
// @connect 10.6.8.131
// @connect 10.6.10.102
// @connect 10.6.9.139
// @connect 10.6.10.195
// @connect 10.6.9.206
// @connect 10.6.9.88
// @connect 10.6.10.104
// @connect 10.6.9.230
// @connect 10.6.8.87
// @connect 10.6.10.36
// @connect 10.6.9.142
// @connect 10.6.8.224
// @connect 10.6.9.89
// @connect 10.6.9.194
// @connect 10.6.9.223
// @connect 10.6.8.163
// @connect 10.6.10.6
// @connect 10.6.9.8
// @connect 10.6.9.138
// @connect 10.6.10.164
// @connect 10.6.9.26
// @connect 10.6.9.80
// @connect 10.6.9.34
// @connect 10.6.8.227
// @connect 10.6.8.201
// @connect 10.6.8.30
// @connect 10.6.9.198
// @connect 10.6.8.96
// @connect 10.6.10.15
// @connect 10.6.8.93
// @connect 10.6.45.41
// @connect 10.6.10.21
// @connect 10.6.9.163
// @connect 10.6.9.208
// @connect 10.6.10.14
// @connect 10.6.10.94
// @connect 10.6.9.98
// @connect 10.6.9.72
// @connect 10.6.8.67
// @connect 10.6.8.12
// @connect 10.6.9.28
// @connect 10.6.9.5
// @connect 10.6.8.200
// @connect 10.6.9.159
// @connect 10.6.9.167
// @connect 10.6.9.145
// @connect 10.6.8.15
// @connect 10.6.10.16
// @connect 10.6.9.131
// @connect 10.6.9.7
// @connect 10.6.8.37
// @connect 10.6.9.10
// @connect 10.6.9.211
// @connect 10.6.10.197
// @connect 10.6.9.210
// @connect 10.6.10.163
// @connect 10.6.9.196
// @connect 10.6.9.90
// @connect 10.6.9.92
// @connect 10.6.9.162
// @connect 10.6.9.144
// @connect 10.6.9.227
// @connect 10.6.9.219
// @connect 10.6.8.134
// @connect 10.6.9.84
// @connect 10.6.9.37
// @connect 10.6.8.27
// @connect 10.6.8.69
// @connect 10.6.8.20
// @connect 10.6.8.205
// @connect 10.6.8.39
// @connect 10.6.10.8
// @connect 10.6.8.231
// @connect 10.6.9.101
// @connect 10.6.8.161
// @connect 10.6.8.212
// @connect 10.6.10.9
// @connect 10.6.10.198
// @connect 10.6.8.202
// @connect 10.6.9.195
// @connect 10.6.9.161
// @connect 10.6.10.199
// @connect 10.6.9.156
// @connect 10.6.10.210
// @connect 10.6.10.86
// @connect 10.6.10.90
// @connect 10.6.9.15
// @connect 10.6.9.99
// @connect 10.6.8.91
// @connect 10.6.10.92
// @connect 10.6.10.105
// @connect 10.6.9.16
// @connect 10.6.8.211
// @connect 10.6.9.218
// @connect 10.6.8.70
// @connect 10.6.8.166
// @connect 10.6.8.100
// @connect 10.6.9.33
// @connect 10.6.8.196
// @connect 10.6.9.215
// @connect 10.6.8.158
// @connect 10.6.8.75
// @connect 10.6.8.24
// @connect 10.6.8.7
// @connect 10.6.9.97
// @connect 10.6.8.194
// @connect 10.6.10.32
// @connect 10.6.10.17
// @connect 10.6.8.155
// @connect 10.6.8.168
// @connect 10.6.9.160
// @connect 10.6.10.22
// @connect 10.6.8.81
// @connect 10.6.9.134
// @connect 10.6.8.144
// @connect 10.6.10.203
// @connect 10.6.9.136
// @connect 10.6.8.152
// @connect 10.6.9.94
// @connect 10.6.10.91
// @connect 10.6.8.223
// @connect 10.6.8.147
// @connect 10.6.9.12
// @connect 10.6.10.7
// @connect 10.6.9.32
// @connect 10.6.9.220
// @connect 10.6.9.166
// @connect 10.6.8.29
// @connect 10.6.8.76
// @connect 10.6.10.166
// @connect 10.6.8.159
// @connect 10.6.10.157
// @connect 10.6.8.14
// @connect 10.6.10.88
// @connect 10.6.8.157
// @connect 10.6.8.206
// @connect 10.6.9.141
// @connect 10.6.10.38
// @connect 10.6.8.73
// @connect 10.6.8.8
// @connect 10.6.8.216
// @connect 10.6.8.10
// @connect 10.6.10.97
// @connect 10.6.9.66
// @connect 10.6.10.98
// @connect 10.6.8.28
// @connect 10.6.8.234
// @connect 10.6.8.36
// @connect 10.6.10.158
// @connect 10.6.9.4
// @connect 10.6.9.91
// @connect 10.6.8.136
// @connect 10.6.8.35
// @connect 10.6.9.67
// @connect 10.6.9.225
// @connect 10.6.8.150
// @connect 10.6.10.159
// @connect 10.6.9.38
// @connect 10.6.9.93
// @connect 10.6.9.78
// @connect 10.6.9.81
// @connect 10.6.9.35
// @connect 10.6.9.154
// @connect 10.6.8.210
// @connect 10.6.9.150
// @connect 10.6.8.34
// @connect 10.6.10.20
// @connect 10.6.9.214
// @connect 10.6.6.95
// @connect 10.6.8.74
// @connect 10.6.8.26
// @connect 10.6.9.102
// @connect 10.6.8.137
// @connect 10.6.10.96
// @connect 10.6.9.39
// @connect 10.6.9.70
// @connect 10.6.8.221
// @connect 10.6.9.76
// @connect 10.6.10.3
// @connect 10.6.9.9
// @connect 10.6.8.82
// @connect 10.6.9.95
// @connect 10.6.9.3
// @connect 10.6.8.19
// @connect 10.6.10.19
// @connect 10.6.8.6
// @connect 10.6.8.94
// @connect 10.6.8.32
// @connect 10.6.8.68
// @connect 10.6.8.167
// @connect 10.6.8.98
// @connect 10.6.10.200
// @connect 10.6.8.217
// @connect 10.6.10.12
// @connect 10.6.8.3
// @connect 10.6.8.21
// @connect 10.6.9.71
// @connect 10.6.8.209
// @connect 10.6.9.74
// @connect 10.6.8.203
// @connect 10.6.10.27
// @connect 10.6.8.149
// @connect 10.6.9.199
// @connect 10.6.8.86
// @connect 10.6.9.25
// @connect 10.6.8.204
// @connect 10.6.8.133
// @connect 10.6.9.68
// @connect 10.6.9.212
// @connect 10.6.9.137
// @connect 10.6.9.96
// @connect 10.6.10.11
// @connect 10.6.9.19
// @connect 10.6.8.92
// @connect 10.6.8.80
// @connect 10.6.8.72
// @connect 10.6.9.226
// @connect 10.6.10.206
// @connect 10.6.9.130
// @connect 10.6.8.198
// @connect 10.6.9.228
// @connect 10.6.9.201
// @connect 10.6.9.20
// @connect 10.6.9.149
// @connect 10.6.8.25
// @connect 10.6.8.4
// @connect 10.6.9.132
// @connect 10.6.10.169
// @connect 10.6.9.202
// @connect 10.6.10.18
// @connect 10.6.8.23
// @connect 10.6.8.215
// @connect 10.6.41.141
// @connect 10.6.10.196
// @connect 10.6.10.101
// @connect 10.6.9.73
// @connect 10.6.9.22
// @connect 10.6.9.2
// @connect 10.6.9.165
// @connect 10.6.9.29
// @connect 10.6.8.16
// @connect 10.6.8.31
// @connect 10.6.10.29
// @connect 10.6.9.229
// @connect 10.6.10.201
// @connect 10.6.10.100
// @connect 10.6.9.27
// @connect 10.6.8.83
// @connect 10.6.8.213
// @connect 10.6.9.148
// @connect 10.6.10.162
// @connect 10.6.9.133
// @connect 10.6.8.214
// @connect 10.6.10.4
// @connect 10.6.8.228
// @connect 10.6.9.21
// @connect 10.6.9.151
// @connect 10.6.9.100
// @connect 10.6.9.17
// @connect 10.6.10.160
// @connect 10.6.9.216
// @connect 10.6.10.85
// @connect 10.6.8.18
// @connect 10.6.8.11
// @connect 10.6.10.202
// @connect 10.6.9.168
// @connect 10.6.9.200
// @connect 10.6.9.209
// @connect 10.6.8.197
// @connect 10.6.8.225
// @connect 10.6.10.214
// @connect 10.6.8.207
// @connect 10.6.9.204
// @connect 10.6.10.2
// @connect 10.6.10.10
// @connect 10.6.10.133
// @connect 10.6.9.143
// @connect 10.6.9.164
// @connect 10.6.8.138
// @connect 10.6.9.231
// @connect 10.6.8.89
// @connect 10.6.8.84
// @connect 10.6.8.229
// @connect 10.6.8.79
// @connect 10.6.8.164
// @connect 10.6.9.205
// @connect 10.6.9.158
// @connect 10.6.9.104
// @connect 10.6.8.162
// @connect 10.6.8.99
// @connect 10.6.8.102
// @connect 10.6.10.209
// @connect 10.6.10.165
// @connect 10.6.9.105
// @connect 10.6.8.142
// @connect 10.6.9.213
// @connect 10.6.8.154
// @connect 10.6.9.232
// @connect 10.6.8.41
// @connect 10.6.8.77
// @connect 10.6.9.82
// @connect 10.6.8.218
// @connect 10.6.10.13
// @connect 10.6.9.69
// @connect 10.6.9.87
// @connect 10.6.9.13
// @connect 10.6.8.141
// @connect 10.6.9.203
// @connect 10.6.9.197
// @connect 10.6.9.157
// @connect 10.6.8.226
// @connect 10.6.10.204
// @connect 10.6.8.88
// @connect 10.6.9.85
// @connect 10.6.9.146
// @connect 10.6.9.83
// @connect 10.6.10.87
// @connect 10.6.9.40
// @connect 10.6.10.205
// @connect 10.6.8.5
// @connect 10.6.9.217
// @connect 10.6.8.208
// @connect 10.6.10.5
// @connect 10.6.8.151
// @connect 10.6.8.33
// @connect 10.6.8.219
// @connect 10.6.9.24
// @connect 10.6.8.103
// @connect 10.6.10.89
// @connect 10.6.10.161
// @connect 10.6.9.75
// @connect 10.6.9.152
// @connect 10.6.10.167
// @connect 10.6.9.224
// @connect 10.6.9.135
// @connect 10.6.9.31
// @connect 10.6.10.194
// @connect 10.6.9.155
// @connect 10.6.9.207
// @connect 10.6.10.93
// @connect 10.6.8.85
// @connect 10.6.10.103
// @connect 10.6.9.147
// @connect 10.6.10.25
// @connect 10.6.9.221
// @connect 10.6.8.40
// @connect 10.6.10.168
// @connect 10.6.8.146
// @connect 10.6.9.79
// @connect 10.6.8.140
// @connect 10.6.8.104
// @connect 10.6.8.17
// @connect 10.6.9.103
// @connect 10.6.8.130
// @connect 10.6.8.156
// @connect 10.6.9.222
// @connect 10.6.8.90
// @connect 10.6.8.165
// @connect 10.6.9.153
// @connect 10.6.8.153
// @connect 10.6.8.145
// @connect 10.6.10.207
// @connect 10.6.10.99
// @connect 10.6.8.132
// @connect 10.6.8.148
// @connect 10.6.8.220
// @connect 10.6.8.135
// @connect 10.6.8.95
// @connect 10.6.10.95
// @connect 10.6.9.36
// @connect 10.6.8.9
// @connect 10.6.9.23
// @connect 10.6.8.22
// @connect 10.6.9.30
// @connect 10.6.10.39
// @connect 10.6.10.26
// @connect 10.6.10.28
// @connect 10.6.10.76
// @connect 10.6.10.30
// @connect 10.6.10.221
// @connect 10.6.10.82
// @connect 10.6.10.68
// @connect 10.6.10.78
// @connect 10.6.10.66
// @connect 10.6.10.40
// @connect 10.6.10.70
// @connect 10.6.10.75
// @connect 10.6.10.23
// @connect 10.6.10.34
// @connect 10.6.10.84
// @connect 10.6.10.81
// @connect 10.6.10.37
// @connect 10.6.10.224
// @connect 10.6.10.69
// @connect 10.6.10.71
// @connect 10.6.10.31
// @connect 10.6.10.77
// @connect 10.6.10.35
// @connect 10.6.10.41
// @connect 10.6.10.67
// @connect 10.6.10.132
// @connect 10.6.10.83
// @connect 10.6.10.74
// @connect 10.6.10.80
// @connect 10.6.10.130
// @connect 10.6.10.79
// @connect 10.6.10.143
// @connect 10.6.10.72
// @connect 10.6.10.142
// @connect 10.6.10.136
// @connect 10.6.10.73
// @connect 10.6.10.139
// @connect 10.6.10.150
// @connect 10.6.10.145
// @connect 10.6.10.141
// @connect 10.6.10.155
// @connect 10.6.10.153
// @connect 10.6.10.134
// @connect 10.6.10.135
// @connect 10.6.10.144
// @connect 10.6.10.146
// @connect 10.6.10.138
// @connect 10.6.10.147
// @connect 10.6.10.131
// @connect 10.6.10.151
// @connect 10.6.10.140
// @connect 10.6.10.148
// @connect 10.6.10.156
// @connect 10.6.10.24
// @connect 10.6.10.154
// @connect 10.6.10.137
// @connect 10.6.10.149
// @connect 10.6.10.208
// @connect 10.6.10.152
// @connect 10.6.11.66
// @connect 10.6.10.223
// @connect 10.6.11.69
// @connect 10.6.10.211
// @connect 10.6.11.20
// @connect 10.6.10.213
// @connect 10.6.10.228
// @connect 10.6.10.217
// @connect 10.6.10.225
// @connect 10.6.11.3
// @connect 10.6.10.212
// @connect 10.6.11.11
// @connect 10.6.10.227
// @connect 10.6.11.6
// @connect 10.6.11.7
// @connect 10.6.10.215
// @connect 10.6.11.19
// @connect 10.6.11.4
// @connect 10.6.10.222
// @connect 10.6.11.27
// @connect 10.6.10.220
// @connect 10.6.11.30
// @connect 10.6.10.226
// @connect 10.6.11.12
// @connect 10.6.11.24
// @connect 10.6.11.68
// @connect 10.6.11.17
// @connect 10.6.11.32
// @connect 10.6.11.5
// @connect 10.6.11.15
// @connect 10.6.11.79
// @connect 10.6.8.13
// @connect 10.6.11.14
// @connect 10.6.11.89
// @connect 10.6.10.218
// @connect 10.6.11.22
// @connect 10.6.11.8
// @connect 10.6.11.31
// @connect 10.6.11.10
// @connect 10.6.11.39
// @connect 10.6.11.2
// @connect 10.6.11.16
// @connect 10.6.11.28
// @connect 10.6.11.41
// @connect 10.6.11.25
// @connect 10.6.11.13
// @connect 10.6.11.78
// @connect 10.6.11.40
// @connect 10.6.10.219
// @connect 10.6.10.233
// @connect 10.6.10.232
// @connect 10.6.11.76
// @connect 10.6.11.21
// @connect 10.6.11.70
// @connect 10.6.11.75
// @connect 10.6.11.71
// @connect 10.6.11.36
// @connect 10.6.10.231
// @connect 10.6.10.216
// @connect 10.6.10.229
// @connect 10.6.10.230
// @connect 10.6.11.80
// @connect 10.6.11.33
// @connect 10.6.11.92
// @connect 10.6.11.73
// @connect 10.6.11.18
// @connect 10.6.11.77
// @connect 10.6.11.104
// @connect 10.6.11.90
// @connect 10.6.11.82
// @connect 10.6.11.9
// @connect 10.6.11.35
// @connect 10.6.11.38
// @connect 10.6.11.83
// @connect 10.6.11.29
// @connect 10.6.11.94
// @connect 10.6.11.91
// @connect 10.6.11.37
// @connect 10.6.11.87
// @connect 10.6.11.81
// @connect 10.6.11.67
// @connect 10.6.11.84
// @connect 10.6.11.88
// @connect 10.6.11.85
// @connect 10.6.11.23
// @connect 10.6.11.74
// @connect 10.6.11.34
// @connect 10.6.11.72
// @connect 10.6.11.97
// @connect 10.6.8.42
// @connect 10.6.9.41
// @connect 10.6.8.106
// @connect 10.6.8.105
// @connect 10.6.9.169
// @connect 10.6.0.140
// @connect 10.6.11.102
// @connect 10.6.11.93
// @connect 10.6.11.96
// @connect 10.6.11.101
// @connect 10.6.11.95
// @connect 10.6.11.99
// @connect 10.6.11.98
// @connect 10.6.41.204
// @connect 10.6.11.100
// @connect 10.6.0.146
// @connect 10.6.0.150
// @connect 10.6.0.144
// @connect 10.6.0.151
// @connect 10.6.0.145
// @connect 10.6.0.147
// @connect 10.6.0.160
// @connect 10.6.0.143
// @connect 10.6.1.94
// @connect 10.6.2.7
// @connect 10.6.2.219
// @connect 10.6.13.25
// @connect 10.6.12.84
// @connect 10.6.12.80
// @connect 10.6.12.79
// @connect 10.6.12.83
// @connect 10.6.12.70
// @connect 10.6.12.69
// @connect 10.6.12.92
// @connect 10.6.12.90
// @connect 10.6.12.96
// @connect 10.6.12.102
// @connect 10.6.12.170
// @connect 10.6.12.75
// @connect 10.6.12.88
// @connect 10.6.12.73
// @connect 10.6.12.74
// @connect 10.6.13.39
// @connect 10.6.12.77
// @connect 10.6.12.72
// @connect 10.6.12.103
// @connect 10.6.12.71
// @connect 10.6.12.91
// @connect 10.6.12.94
// @connect 10.6.12.81
// @connect 10.6.12.78
// @connect 10.6.12.89
// @connect 10.6.12.76
// @connect 10.6.12.97
// @connect 10.6.12.82
// @connect 10.6.12.101
// @connect 10.6.12.95
// @connect 10.6.12.86
// @connect 10.6.12.100
// @connect 10.6.13.100
// @connect 10.6.12.99
// @connect 10.6.12.85
// @connect 10.6.12.98
// @connect 10.6.12.93
// @connect 10.6.12.198
// @connect 10.6.12.196
// @connect 10.6.12.146
// @connect 10.6.12.218
// @connect 10.6.12.150
// @connect 10.6.55.10
// @connect 10.6.12.148
// @connect 10.6.12.152
// @connect 10.6.12.144
// @connect 10.6.12.199
// @connect 10.6.12.157
// @connect 10.6.12.211
// @connect 10.6.12.216
// @connect 10.6.12.154
// @connect 10.6.12.135
// @connect 10.6.12.160
// @connect 10.6.12.230
// @connect 10.6.12.232
// @connect 10.6.12.205
// @connect 10.6.13.13
// @connect 10.6.13.14
// @connect 10.6.12.212
// @connect 10.6.12.209
// @connect 10.6.12.227
// @connect 10.6.12.220
// @connect 10.6.13.7
// @connect 10.6.13.41
// @connect 10.6.13.9
// @connect 10.6.12.137
// @connect 10.6.12.219
// @connect 10.6.12.208
// @connect 10.6.42.27
// @connect 10.6.13.38
// @connect 10.6.13.92
// @connect 10.6.13.21
// @connect 10.6.12.229
// @connect 10.6.13.37
// @connect 10.6.13.31
// @connect 10.6.13.17
// @connect 10.6.12.136
// @connect 10.6.13.30
// @connect 10.6.12.155
// @connect 10.6.13.217
// @connect 10.6.13.226
// @connect 10.6.12.233
// @connect 10.6.12.215
// @connect 10.6.13.15
// @connect 10.6.13.158
// @connect 10.6.12.143
// @connect 10.6.12.203
// @connect 10.6.13.85
// @connect 10.6.13.82
// @connect 10.6.13.89
// @connect 10.6.13.147
// @connect 10.6.12.195
// @connect 10.6.13.26
// @connect 10.6.13.90
// @connect 10.6.12.206
// @connect 10.6.13.138
// @connect 10.6.12.149
// @connect 10.6.13.83
// @connect 10.6.12.145
// @connect 10.6.12.164
// @connect 10.6.13.96
// @connect 10.6.13.23
// @connect 10.6.12.105
// @connect 10.6.13.131
// @connect 10.6.13.166
// @connect 10.6.12.201
// @connect 10.6.13.141
// @connect 10.6.13.225
// @connect 10.6.13.86
// @connect 10.6.13.18
// @connect 10.6.13.206
// @connect 10.6.12.231
// @connect 10.6.13.132
// @connect 10.6.13.211
// @connect 10.6.13.98
// @connect 10.6.13.8
// @connect 10.6.13.87
// @connect 10.6.13.33
// @connect 10.6.13.24
// @connect 10.6.13.10
// @connect 10.6.12.202
// @connect 10.6.12.225
// @connect 10.6.12.151
// @connect 10.6.12.133
// @connect 10.6.13.16
// @connect 10.6.12.221
// @connect 10.6.13.94
// @connect 10.6.14.70
// @connect 10.6.13.11
// @connect 10.6.12.153
// @connect 10.6.13.209
// @connect 10.6.13.203
// @connect 10.6.12.166
// @connect 10.6.12.104
// @connect 10.6.13.2
// @connect 10.6.12.162
// @connect 10.6.12.204
// @connect 10.6.12.139
// @connect 10.6.13.143
// @connect 10.6.13.157
// @connect 10.6.13.97
// @connect 10.6.13.146
// @connect 10.6.13.91
// @connect 10.6.12.134
// @connect 10.6.12.194
// @connect 10.6.13.219
// @connect 10.6.13.19
// @connect 10.6.13.155
// @connect 10.6.13.66
// @connect 10.6.14.4
// @connect 10.6.13.231
// @connect 10.6.13.144
// @connect 10.6.12.224
// @connect 10.6.12.130
// @connect 10.6.13.74
// @connect 10.6.13.81
// @connect 10.6.12.207
// @connect 10.6.13.137
// @connect 10.6.13.35
// @connect 10.6.14.6
// @connect 10.6.13.199
// @connect 10.6.13.3
// @connect 10.6.13.95
// @connect 10.6.13.34
// @connect 10.6.12.138
// @connect 10.6.12.197
// @connect 10.6.12.163
// @connect 10.6.13.218
// @connect 10.6.14.5
// @connect 10.6.12.214
// @connect 10.6.13.104
// @connect 10.6.13.152
// @connect 10.6.13.169
// @connect 10.6.13.212
// @connect 10.6.13.149
// @connect 10.6.13.88
// @connect 10.6.13.75
// @connect 10.6.14.13
// @connect 10.6.13.221
// @connect 10.6.12.200
// @connect 10.6.13.230
// @connect 10.6.13.71
// @connect 10.6.13.70
// @connect 10.6.13.40
// @connect 10.6.12.159
// @connect 10.6.13.134
// @connect 10.6.13.84
// @connect 10.6.14.30
// @connect 10.6.12.132
// @connect 10.6.14.82
// @connect 10.6.12.158
// @connect 10.6.13.6
// @connect 10.6.13.28
// @connect 10.6.13.200
// @connect 10.6.13.99
// @connect 10.6.13.204
// @connect 10.6.12.217
// @connect 10.6.13.4
// @connect 10.6.13.133
// @connect 10.6.14.15
// @connect 10.6.13.93
// @connect 10.6.13.77
// @connect 10.6.13.80
// @connect 10.6.13.22
// @connect 10.6.13.161
// @connect 10.6.14.92
// @connect 10.6.13.162
// @connect 10.6.13.105
// @connect 10.6.13.12
// @connect 10.6.13.69
// @connect 10.6.14.20
// @connect 10.6.12.223
// @connect 10.6.13.216
// @connect 10.6.13.150
// @connect 10.6.14.23
// @connect 10.6.14.35
// @connect 10.6.12.222
// @connect 10.6.12.213
// @connect 10.6.12.226
// @connect 10.6.14.71
// @connect 10.6.13.153
// @connect 10.6.13.67
// @connect 10.6.12.156
// @connect 10.6.13.27
// @connect 10.6.13.196
// @connect 10.6.13.142
// @connect 10.6.14.2
// @connect 10.6.13.208
// @connect 10.6.14.78
// @connect 10.6.13.68
// @connect 10.6.14.67
// @connect 10.6.14.27
// @connect 10.6.14.31
// @connect 10.6.14.89
// @connect 10.6.14.137
// @connect 10.6.13.20
// @connect 10.6.14.91
// @connect 10.6.13.168
// @connect 10.6.14.86
// @connect 10.6.14.16
// @connect 10.6.13.151
// @connect 10.6.14.34
// @connect 10.6.14.25
// @connect 10.6.44.229
// @connect 10.6.14.39
// @connect 10.6.13.228
// @connect 10.6.14.33
// @connect 10.6.14.17
// @connect 10.6.13.154
// @connect 10.6.13.163
// @connect 10.6.13.79
// @connect 10.6.14.21
// @connect 10.6.13.73
// @connect 10.6.14.79
// @connect 10.6.14.24
// @connect 10.6.13.139
// @connect 10.6.13.214
// @connect 10.6.12.147
// @connect 10.6.14.32
// @connect 10.6.13.164
// @connect 10.6.13.202
// @connect 10.6.13.229
// @connect 10.6.13.215
// @connect 10.6.12.142
// @connect 10.6.14.87
// @connect 10.6.12.141
// @connect 10.6.14.26
// @connect 10.6.13.220
// @connect 10.6.14.90
// @connect 10.6.14.69
// @connect 10.6.14.37
// @connect 10.6.14.29
// @connect 10.6.13.201
// @connect 10.6.13.148
// @connect 10.6.14.7
// @connect 10.6.14.10
// @connect 10.6.14.18
// @connect 10.6.14.74
// @connect 10.6.12.161
// @connect 10.6.13.103
// @connect 10.6.13.197
// @connect 10.6.14.3
// @connect 10.6.13.223
// @connect 10.6.14.9
// @connect 10.6.13.213
// @connect 10.6.13.32
// @connect 10.6.13.136
// @connect 10.6.14.94
// @connect 10.6.14.40
// @connect 10.6.13.36
// @connect 10.6.14.12
// @connect 10.6.13.130
// @connect 10.6.13.210
// @connect 10.6.13.227
// @connect 10.6.13.72
// @connect 10.6.13.165
// @connect 10.6.14.88
// @connect 10.6.13.76
// @connect 10.6.14.85
// @connect 10.6.13.78
// @connect 10.6.13.222
// @connect 10.6.12.131
// @connect 10.6.14.14
// @connect 10.6.13.195
// @connect 10.6.13.156
// @connect 10.6.14.28
// @connect 10.6.14.84
// @connect 10.6.13.101
// @connect 10.6.13.140
// @connect 10.6.14.73
// @connect 10.6.29.42
// @connect 10.6.14.38
// @connect 10.6.13.29
// @connect 10.6.14.81
// @connect 10.6.14.201
// @connect 10.6.13.194
// @connect 10.6.14.19
// @connect 10.6.14.83
// @connect 10.6.13.207
// @connect 10.6.14.159
// @connect 10.6.41.194
// @connect 10.6.13.160
// @connect 10.6.14.68
// @connect 10.6.14.11
// @connect 10.6.13.224
// @connect 10.6.14.72
// @connect 10.6.13.159
// @connect 10.6.13.198
// @connect 10.6.13.232
// @connect 10.6.14.41
// @connect 10.6.14.77
// @connect 10.6.14.22
// @connect 10.6.12.140
// @connect 10.6.14.75
// @connect 10.6.14.36
// @connect 10.6.12.167
// @connect 10.6.14.8
// @connect 10.6.13.145
// @connect 10.6.15.26
// @connect 10.6.14.131
// @connect 10.6.14.140
// @connect 10.6.14.221
// @connect 10.6.14.229
// @connect 10.6.14.203
// @connect 10.6.14.98
// @connect 10.6.14.215
// @connect 10.6.14.146
// @connect 10.6.15.68
// @connect 10.6.15.69
// @connect 10.6.14.231
// @connect 10.6.15.15
// @connect 10.6.14.66
// @connect 10.6.14.95
// @connect 10.6.15.3
// @connect 10.6.14.167
// @connect 10.6.14.142
// @connect 10.6.15.95
// @connect 10.6.14.96
// @connect 10.6.14.220
// @connect 10.6.14.143
// @connect 10.6.15.96
// @connect 10.6.14.132
// @connect 10.6.14.200
// @connect 10.6.15.6
// @connect 10.6.15.101
// @connect 10.6.15.28
// @connect 10.6.14.145
// @connect 10.6.15.41
// @connect 10.6.15.16
// @connect 10.6.14.133
// @connect 10.6.15.66
// @connect 10.6.15.11
// @connect 10.6.14.151
// @connect 10.6.14.141
// @connect 10.6.14.149
// @connect 10.6.15.87
// @connect 10.6.15.89
// @connect 10.6.15.24
// @connect 10.6.14.208
// @connect 10.6.15.27
// @connect 10.6.14.199
// @connect 10.6.14.135
// @connect 10.6.15.102
// @connect 10.6.15.23
// @connect 10.6.14.165
// @connect 10.6.14.169
// @connect 10.6.14.226
// @connect 10.6.15.12
// @connect 10.6.14.214
// @connect 10.6.15.39
// @connect 10.6.14.147
// @connect 10.6.15.91
// @connect 10.6.15.84
// @connect 10.6.14.148
// @connect 10.6.15.70
// @connect 10.6.12.210
// @connect 10.6.14.157
// @connect 10.6.14.230
// @connect 10.6.15.99
// @connect 10.6.14.152
// @connect 10.6.15.34
// @connect 10.6.15.81
// @connect 10.6.15.37
// @connect 10.6.14.209
// @connect 10.6.15.40
// @connect 10.6.14.205
// @connect 10.6.14.138
// @connect 10.6.14.156
// @connect 10.6.14.163
// @connect 10.6.15.33
// @connect 10.6.14.212
// @connect 10.6.15.32
// @connect 10.6.14.198
// @connect 10.6.15.76
// @connect 10.6.14.211
// @connect 10.6.15.18
// @connect 10.6.15.71
// @connect 10.6.14.139
// @connect 10.6.15.14
// @connect 10.6.15.22
// @connect 10.6.14.130
// @connect 10.6.14.195
// @connect 10.6.14.222
// @connect 10.6.14.218
// @connect 10.6.14.93
// @connect 10.6.15.20
// @connect 10.6.14.228
// @connect 10.6.14.154
// @connect 10.6.15.83
// @connect 10.6.14.80
// @connect 10.6.14.136
// @connect 10.6.15.19
// @connect 10.6.14.207
// @connect 10.6.14.100
// @connect 10.6.14.168
// @connect 10.6.14.206
// @connect 10.6.15.72
// @connect 10.6.15.79
// @connect 10.6.14.155
// @connect 10.6.15.85
// @connect 10.6.15.74
// @connect 10.6.15.10
// @connect 10.6.15.25
// @connect 10.6.15.73
// @connect 10.6.15.90
// @connect 10.6.14.153
// @connect 10.6.14.99
// @connect 10.6.15.97
// @connect 10.6.15.75
// @connect 10.6.15.80
// @connect 10.6.14.194
// @connect 10.6.14.227
// @connect 10.6.15.29
// @connect 10.6.15.35
// @connect 10.6.15.100
// @connect 10.6.14.197
// @connect 10.6.15.4
// @connect 10.6.14.160
// @connect 10.6.15.38
// @connect 10.6.15.92
// @connect 10.6.14.150
// @connect 10.6.15.17
// @connect 10.6.14.217
// @connect 10.6.14.166
// @connect 10.6.14.134
// @connect 10.6.14.144
// @connect 10.6.15.21
// @connect 10.6.15.103
// @connect 10.6.14.219
// @connect 10.6.15.9
// @connect 10.6.15.13
// @connect 10.6.15.7
// @connect 10.6.14.196
// @connect 10.6.15.30
// @connect 10.6.15.31
// @connect 10.6.15.82
// @connect 10.6.15.2
// @connect 10.6.14.213
// @connect 10.6.14.216
// @connect 10.6.15.67
// @connect 10.6.15.86
// @connect 10.6.14.210
// @connect 10.6.14.158
// @connect 10.6.14.162
// @connect 10.6.14.224
// @connect 10.6.15.8
// @connect 10.6.14.102
// @connect 10.6.14.103
// @connect 10.6.14.101
// @connect 10.6.15.77
// @connect 10.6.14.202
// @connect 10.6.14.104
// @connect 10.6.15.36
// @connect 10.6.14.164
// @connect 10.6.15.88
// @connect 10.6.15.78
// @connect 10.6.14.225
// @connect 10.6.14.204
// @connect 10.6.15.93
// @connect 10.6.15.105
// @connect 10.6.15.98
// @connect 10.6.15.104
// @connect 10.6.24.6
// @connect 10.6.24.99
// @connect 10.6.24.18
// @connect 10.6.24.30
// @connect 10.6.24.16
// @connect 10.6.24.2
// @connect 10.6.24.7
// @connect 10.6.24.40
// @connect 10.6.24.9
// @connect 10.6.24.5
// @connect 10.6.24.84
// @connect 10.6.24.19
// @connect 10.6.24.80
// @connect 10.6.24.14
// @connect 10.6.24.8
// @connect 10.6.24.25
// @connect 10.6.24.3
// @connect 10.6.24.74
// @connect 10.6.24.94
// @connect 10.6.24.12
// @connect 10.6.24.81
// @connect 10.6.24.24
// @connect 10.6.24.17
// @connect 10.6.24.35
// @connect 10.6.24.23
// @connect 10.6.24.28
// @connect 10.6.24.22
// @connect 10.6.24.20
// @connect 10.6.24.27
// @connect 10.6.24.36
// @connect 10.6.24.96
// @connect 10.6.24.83
// @connect 10.6.24.21
// @connect 10.6.24.41
// @connect 10.6.24.26
// @connect 10.6.24.92
// @connect 10.6.24.90
// @connect 10.6.24.33
// @connect 10.6.24.71
// @connect 10.6.24.34
// @connect 10.6.24.31
// @connect 10.6.27.20
// @connect 10.6.24.32
// @connect 10.6.24.39
// @connect 10.6.24.93
// @connect 10.6.24.102
// @connect 10.6.24.103
// @connect 10.6.24.87
// @connect 10.6.24.98
// @connect 10.6.24.77
// @connect 10.6.24.144
// @connect 10.6.24.101
// @connect 10.6.24.85
// @connect 10.6.24.151
// @connect 10.6.24.89
// @connect 10.6.24.141
// @connect 10.6.24.75
// @connect 10.6.24.10
// @connect 10.6.24.139
// @connect 10.6.24.91
// @connect 10.6.24.37
// @connect 10.6.24.88
// @connect 10.6.24.97
// @connect 10.6.24.78
// @connect 10.6.25.8
// @connect 10.6.24.73
// @connect 10.6.24.146
// @connect 10.6.24.100
// @connect 10.6.24.15
// @connect 10.6.24.13
// @connect 10.6.24.67
// @connect 10.6.24.142
// @connect 10.6.24.133
// @connect 10.6.24.153
// @connect 10.6.24.72
// @connect 10.6.24.140
// @connect 10.6.24.66
// @connect 10.6.24.150
// @connect 10.6.24.130
// @connect 10.6.24.132
// @connect 10.6.24.11
// @connect 10.6.24.159
// @connect 10.6.24.157
// @connect 10.6.24.69
// @connect 10.6.24.137
// @connect 10.6.24.38
// @connect 10.6.24.147
// @connect 10.6.24.200
// @connect 10.6.24.148
// @connect 10.6.24.196
// @connect 10.6.24.79
// @connect 10.6.24.70
// @connect 10.6.24.138
// @connect 10.6.24.29
// @connect 10.6.24.197
// @connect 10.6.24.201
// @connect 10.6.24.164
// @connect 10.6.24.198
// @connect 10.6.24.194
// @connect 10.6.24.68
// @connect 10.6.24.208
// @connect 10.6.24.136
// @connect 10.6.24.232
// @connect 10.6.24.4
// @connect 10.6.24.145
// @connect 10.6.24.154
// @connect 10.6.24.156
// @connect 10.6.24.143
// @connect 10.6.24.134
// @connect 10.6.24.158
// @connect 10.6.24.152
// @connect 10.6.24.82
// @connect 10.6.24.131
// @connect 10.6.24.149
// @connect 10.6.24.195
// @connect 10.6.24.162
// @connect 10.6.24.160
// @connect 10.6.24.161
// @connect 10.6.24.217
// @connect 10.6.24.155
// @connect 10.6.25.104
// @connect 10.6.25.91
// @connect 10.6.24.220
// @connect 10.6.24.207
// @connect 10.6.24.222
// @connect 10.6.24.199
// @connect 10.6.25.29
// @connect 10.6.24.204
// @connect 10.6.24.165
// @connect 10.6.25.6
// @connect 10.6.25.92
// @connect 10.6.24.202
// @connect 10.6.24.228
// @connect 10.6.24.209
// @connect 10.6.24.211
// @connect 10.6.24.218
// @connect 10.6.25.2
// @connect 10.6.25.18
// @connect 10.6.25.5
// @connect 10.6.26.40
// @connect 10.6.25.14
// @connect 10.6.25.144
// @connect 10.6.26.35
// @connect 10.6.26.219
// @connect 10.6.24.205
// @connect 10.6.26.66
// @connect 10.6.24.225
// @connect 10.6.26.76
// @connect 10.6.41.164
// @connect 10.6.41.149
// @connect 10.6.25.103
// @connect 10.6.25.82
// @connect 10.6.26.136
// @connect 10.6.25.3
// @connect 10.6.25.9
// @connect 10.6.24.203
// @connect 10.6.26.150
// @connect 10.6.26.146
// @connect 10.6.24.216
// @connect 10.6.26.154
// @connect 10.6.25.98
// @connect 10.6.25.17
// @connect 10.6.26.68
// @connect 10.6.25.216
// @connect 10.6.24.231
// @connect 10.6.25.213
// @connect 10.6.25.15
// @connect 10.6.24.230
// @connect 10.6.26.71
// @connect 10.6.25.71
// @connect 10.6.25.40
// @connect 10.6.24.223
// @connect 10.6.25.161
// @connect 10.6.26.210
// @connect 10.6.25.68
// @connect 10.6.25.19
// @connect 10.6.25.41
// @connect 10.6.24.219
// @connect 10.6.25.21
// @connect 10.6.24.206
// @connect 10.6.26.223
// @connect 10.6.25.89
// @connect 10.6.25.11
// @connect 10.6.26.31
// @connect 10.6.25.200
// @connect 10.6.25.10
// @connect 10.6.25.87
// @connect 10.6.26.159
// @connect 10.6.25.105
// @connect 10.6.25.152
// @connect 10.6.26.36
// @connect 10.6.26.148
// @connect 10.6.25.76
// @connect 10.6.25.16
// @connect 10.6.26.220
// @connect 10.6.26.86
// @connect 10.6.25.30
// @connect 10.6.25.12
// @connect 10.6.24.221
// @connect 10.6.26.73
// @connect 10.6.25.215
// @connect 10.6.26.85
// @connect 10.6.26.133
// @connect 10.6.26.9
// @connect 10.6.25.70
// @connect 10.6.24.215
// @connect 10.6.25.207
// @connect 10.6.25.137
// @connect 10.6.26.214
// @connect 10.6.25.198
// @connect 10.6.26.131
// @connect 10.6.26.11
// @connect 10.6.41.162
// @connect 10.6.26.3
// @connect 10.6.24.227
// @connect 10.6.26.230
// @connect 10.6.26.16
// @connect 10.6.25.97
// @connect 10.6.24.213
// @connect 10.6.25.224
// @connect 10.6.26.98
// @connect 10.6.27.6
// @connect 10.6.26.166
// @connect 10.6.25.88
// @connect 10.6.26.21
// @connect 10.6.25.231
// @connect 10.6.25.26
// @connect 10.6.25.165
// @connect 10.6.27.12
// @connect 10.6.26.156
// @connect 10.6.25.208
// @connect 10.6.25.133
// @connect 10.6.45.83
// @connect 10.6.25.148
// @connect 10.6.26.215
// @connect 10.6.26.197
// @connect 10.6.25.197
// @connect 10.6.26.195
// @connect 10.6.25.33
// @connect 10.6.26.103
// @connect 10.6.26.37
// @connect 10.6.27.5
// @connect 10.6.26.13
// @connect 10.6.25.77
// @connect 10.6.25.163
// @connect 10.6.27.98
// @connect 10.6.25.206
// @connect 10.6.26.157
// @connect 10.6.25.142
// @connect 10.6.26.100
// @connect 10.6.26.69
// @connect 10.6.24.233
// @connect 10.6.25.130
// @connect 10.6.25.225
// @connect 10.6.26.229
// @connect 10.6.26.224
// @connect 10.6.25.25
// @connect 10.6.26.101
// @connect 10.6.26.168
// @connect 10.6.26.130
// @connect 10.6.27.8
// @connect 10.6.26.152
// @connect 10.6.26.163
// @connect 10.6.26.18
// @connect 10.6.25.203
// @connect 10.6.26.201
// @connect 10.6.24.226
// @connect 10.6.26.12
// @connect 10.6.24.212
// @connect 10.6.26.67
// @connect 10.6.27.15
// @connect 10.6.25.166
// @connect 10.6.26.149
// @connect 10.6.25.7
// @connect 10.6.25.37
// @connect 10.6.26.204
// @connect 10.6.26.221
// @connect 10.6.25.221
// @connect 10.6.26.33
// @connect 10.6.25.230
// @connect 10.6.24.214
// @connect 10.6.25.211
// @connect 10.6.25.38
// @connect 10.6.26.102
// @connect 10.6.26.144
// @connect 10.6.25.94
// @connect 10.6.25.222
// @connect 10.6.26.143
// @connect 10.6.26.26
// @connect 10.6.25.75
// @connect 10.6.27.102
// @connect 10.6.26.84
// @connect 10.6.26.38
// @connect 10.6.25.204
// @connect 10.6.26.7
// @connect 10.6.25.159
// @connect 10.6.41.214
// @connect 10.6.25.220
// @connect 10.6.26.8
// @connect 10.6.25.164
// @connect 10.6.26.6
// @connect 10.6.25.212
// @connect 10.6.25.145
// @connect 10.6.25.24
// @connect 10.6.25.35
// @connect 10.6.26.194
// @connect 10.6.26.75
// @connect 10.6.25.199
// @connect 10.6.26.160
// @connect 10.6.27.11
// @connect 10.6.26.30
// @connect 10.6.25.233
// @connect 10.6.26.153
// @connect 10.6.25.31
// @connect 10.6.25.229
// @connect 10.6.25.36
// @connect 10.6.26.164
// @connect 10.6.25.99
// @connect 10.6.26.82
// @connect 10.6.25.219
// @connect 10.6.25.32
// @connect 10.6.25.93
// @connect 10.6.25.156
// @connect 10.6.25.196
// @connect 10.6.26.10
// @connect 10.6.26.139
// @connect 10.6.26.97
// @connect 10.6.25.217
// @connect 10.6.25.22
// @connect 10.6.25.86
// @connect 10.6.25.140
// @connect 10.6.26.208
// @connect 10.6.27.73
// @connect 10.6.26.72
// @connect 10.6.27.3
// @connect 10.6.25.4
// @connect 10.6.24.163
// @connect 10.6.27.10
// @connect 10.6.25.73
// @connect 10.6.25.139
// @connect 10.6.26.25
// @connect 10.6.25.218
// @connect 10.6.26.158
// @connect 10.6.24.135
// @connect 10.6.24.229
// @connect 10.6.25.78
// @connect 10.6.26.225
// @connect 10.6.25.167
// @connect 10.6.25.84
// @connect 10.6.25.80
// @connect 10.6.27.30
// @connect 10.6.26.200
// @connect 10.6.26.91
// @connect 10.6.25.39
// @connect 10.6.25.153
// @connect 10.6.26.162
// @connect 10.6.26.207
// @connect 10.6.26.95
// @connect 10.6.26.232
// @connect 10.6.26.94
// @connect 10.6.25.67
// @connect 10.6.26.2
// @connect 10.6.25.160
// @connect 10.6.25.74
// @connect 10.6.26.74
// @connect 10.6.24.210
// @connect 10.6.27.89
// @connect 10.6.26.140
// @connect 10.6.26.211
// @connect 10.6.26.27
// @connect 10.6.26.79
// @connect 10.6.25.20
// @connect 10.6.27.17
// @connect 10.6.26.4
// @connect 10.6.26.167
// @connect 10.6.26.212
// @connect 10.6.25.195
// @connect 10.6.25.95
// @connect 10.6.26.78
// @connect 10.6.27.4
// @connect 10.6.26.34
// @connect 10.6.25.151
// @connect 10.6.27.84
// @connect 10.6.26.5
// @connect 10.6.25.85
// @connect 10.6.25.79
// @connect 10.6.27.81
// @connect 10.6.26.15
// @connect 10.6.25.28
// @connect 10.6.26.216
// @connect 10.6.26.93
// @connect 10.6.26.142
// @connect 10.6.26.218
// @connect 10.6.26.17
// @connect 10.6.26.145
// @connect 10.6.26.169
// @connect 10.6.26.132
// @connect 10.6.25.83
// @connect 10.6.26.147
// @connect 10.6.26.89
// @connect 10.6.25.202
// @connect 10.6.25.201
// @connect 10.6.26.90
// @connect 10.6.25.147
// @connect 10.6.26.205
// @connect 10.6.25.13
// @connect 10.6.26.227
// @connect 10.6.24.224
// @connect 10.6.26.151
// @connect 10.6.26.209
// @connect 10.6.26.70
// @connect 10.6.27.96
// @connect 10.6.27.66
// @connect 10.6.25.157
// @connect 10.6.27.7
// @connect 10.6.25.194
// @connect 10.6.26.104
// @connect 10.6.25.72
// @connect 10.6.25.27
// @connect 10.6.26.80
// @connect 10.6.27.100
// @connect 10.6.25.23
// @connect 10.6.27.35
// @connect 10.6.26.199
// @connect 10.6.26.226
// @connect 10.6.25.135
// @connect 10.6.25.81
// @connect 10.6.26.202
// @connect 10.6.26.20
// @connect 10.6.25.100
// @connect 10.6.26.92
// @connect 10.6.25.34
// @connect 10.6.26.213
// @connect 10.6.26.217
// @connect 10.6.65.138
// @connect 10.6.25.149
// @connect 10.6.26.222
// @connect 10.6.25.134
// @connect 10.6.26.96
// @connect 10.6.25.66
// @connect 10.6.26.135
// @connect 10.6.27.14
// @connect 10.6.27.25
// @connect 10.6.27.105
// @connect 10.6.25.232
// @connect 10.6.25.96
// @connect 10.6.27.28
// @connect 10.6.25.227
// @connect 10.6.25.226
// @connect 10.6.27.83
// @connect 10.6.25.150
// @connect 10.6.27.16
// @connect 10.6.26.83
// @connect 10.6.25.155
// @connect 10.6.27.68
// @connect 10.6.25.162
// @connect 10.6.25.101
// @connect 10.6.26.165
// @connect 10.6.25.90
// @connect 10.6.26.14
// @connect 10.6.26.228
// @connect 10.6.25.146
// @connect 10.6.25.209
// @connect 10.6.27.36
// @connect 10.6.26.81
// @connect 10.6.26.198
// @connect 10.6.26.141
// @connect 10.6.25.141
// @connect 10.6.27.26
// @connect 10.6.25.143
// @connect 10.6.26.206
// @connect 10.6.26.29
// @connect 10.6.26.138
// @connect 10.6.26.88
// @connect 10.6.27.86
// @connect 10.6.27.69
// @connect 10.6.26.28
// @connect 10.6.26.32
// @connect 10.6.27.97
// @connect 10.6.26.203
// @connect 10.6.25.223
// @connect 10.6.25.228
// @connect 10.6.26.137
// @connect 10.6.25.205
// @connect 10.6.27.9
// @connect 10.6.26.155
// @connect 10.6.26.134
// @connect 10.6.25.210
// @connect 10.6.27.18
// @connect 10.6.26.19
// @connect 10.6.26.77
// @connect 10.6.41.212
// @connect 10.6.26.39
// @connect 10.6.25.69
// @connect 10.6.21.75
// @connect 10.6.27.13
// @connect 10.6.27.32
// @connect 10.6.27.22
// @connect 10.6.27.24
// @connect 10.6.27.34
// @connect 10.6.27.101
// @connect 10.6.24.166
// @connect 10.6.27.87
// @connect 10.6.27.85
// @connect 10.6.26.196
// @connect 10.6.27.92
// @connect 10.6.27.82
// @connect 10.6.27.23
// @connect 10.6.27.40
// @connect 10.6.27.93
// @connect 10.6.27.94
// @connect 10.6.27.91
// @connect 10.6.27.76
// @connect 10.6.27.72
// @connect 10.6.27.88
// @connect 10.6.27.21
// @connect 10.6.27.19
// @connect 10.6.27.71
// @connect 10.6.27.99
// @connect 10.6.27.104
// @connect 10.6.27.31
// @connect 10.6.27.80
// @connect 10.6.27.79
// @connect 10.6.27.90
// @connect 10.6.27.33
// @connect 10.6.27.95
// @connect 10.6.27.39
// @connect 10.6.27.38
// @connect 10.6.27.67
// @connect 10.6.27.103
// @connect 10.6.27.70
// @connect 10.6.27.77
// @connect 10.6.27.74
// @connect 10.6.24.169
// @connect 10.6.24.168
// @connect 10.6.26.233
// @connect 10.6.27.27
// @connect 10.6.13.233
// @connect 10.6.14.233
// @connect 10.6.14.105
// @connect 10.6.14.232
// @connect 10.6.24.104
// @connect 10.6.25.169
// @connect 10.6.27.41
// @connect 10.6.25.158
// @connect 10.6.21.107
// @connect 10.6.21.106
// @connect 10.6.21.108
// @connect 10.6.9.86
// @connect 10.6.4.17
// @connect 10.6.4.80
// @connect 10.6.4.4
// @connect 10.6.4.6
// @connect 10.6.4.13
// @connect 10.6.4.82
// @connect 10.6.4.90
// @connect 10.6.4.69
// @connect 10.6.4.24
// @connect 10.6.4.87
// @connect 10.6.4.29
// @connect 10.6.4.86
// @connect 10.6.4.78
// @connect 10.6.4.3
// @connect 10.6.4.10
// @connect 10.6.4.77
// @connect 10.6.4.7
// @connect 10.6.4.72
// @connect 10.6.4.34
// @connect 10.6.4.100
// @connect 10.6.4.26
// @connect 10.6.4.81
// @connect 10.6.4.14
// @connect 10.6.4.88
// @connect 10.6.4.79
// @connect 10.6.4.27
// @connect 10.6.4.22
// @connect 10.6.4.74
// @connect 10.6.4.85
// @connect 10.6.4.37
// @connect 10.6.4.89
// @connect 10.6.4.96
// @connect 10.6.4.31
// @connect 10.6.4.12
// @connect 10.6.4.92
// @connect 10.6.4.41
// @connect 10.6.4.33
// @connect 10.6.4.84
// @connect 10.6.4.94
// @connect 10.6.4.104
// @connect 10.6.4.15
// @connect 10.6.4.20
// @connect 10.6.4.95
// @connect 10.6.4.68
// @connect 10.6.4.91
// @connect 10.6.4.16
// @connect 10.6.4.18
// @connect 10.6.4.83
// @connect 10.6.4.71
// @connect 10.6.4.36
// @connect 10.6.4.2
// @connect 10.6.4.40
// @connect 10.6.4.141
// @connect 10.6.4.23
// @connect 10.6.4.98
// @connect 10.6.4.32
// @connect 10.6.4.73
// @connect 10.6.4.76
// @connect 10.6.4.25
// @connect 10.6.4.67
// @connect 10.6.4.30
// @connect 10.6.4.21
// @connect 10.6.4.93
// @connect 10.6.4.103
// @connect 10.6.4.99
// @connect 10.6.4.102
// @connect 10.6.4.19
// @connect 10.6.4.70
// @connect 10.6.4.11
// @connect 10.6.4.97
// @connect 10.6.4.101
// @connect 10.6.4.75
// @connect 10.6.4.105
// @connect 10.6.4.8
// @connect 10.6.4.213
// @connect 10.6.5.142
// @connect 10.6.5.4
// @connect 10.6.5.208
// @connect 10.6.5.28
// @connect 10.6.5.3
// @connect 10.6.5.195
// @connect 10.6.5.151
// @connect 10.6.6.7
// @connect 10.6.6.5
// @connect 10.6.4.211
// @connect 10.6.5.219
// @connect 10.6.4.208
// @connect 10.6.5.194
// @connect 10.6.5.169
// @connect 10.6.6.26
// @connect 10.6.5.72
// @connect 10.6.5.22
// @connect 10.6.5.214
// @connect 10.6.4.210
// @connect 10.6.5.203
// @connect 10.6.5.199
// @connect 10.6.5.12
// @connect 10.6.5.6
// @connect 10.6.5.105
// @connect 10.6.5.37
// @connect 10.6.5.168
// @connect 10.6.5.149
// @connect 10.6.4.194
// @connect 10.6.4.197
// @connect 10.6.5.134
// @connect 10.6.5.159
// @connect 10.6.5.21
// @connect 10.6.5.23
// @connect 10.6.6.4
// @connect 10.6.5.155
// @connect 10.6.5.78
// @connect 10.6.4.224
// @connect 10.6.6.8
// @connect 10.6.5.205
// @connect 10.6.4.217
// @connect 10.6.4.215
// @connect 10.6.5.215
// @connect 10.6.4.225
// @connect 10.6.5.69
// @connect 10.6.4.214
// @connect 10.6.5.5
// @connect 10.6.5.130
// @connect 10.6.5.231
// @connect 10.6.5.210
// @connect 10.6.4.196
// @connect 10.6.5.148
// @connect 10.6.5.80
// @connect 10.6.5.165
// @connect 10.6.5.96
// @connect 10.6.6.6
// @connect 10.6.5.18
// @connect 10.6.4.209
// @connect 10.6.5.158
// @connect 10.6.5.230
// @connect 10.6.4.226
// @connect 10.6.4.227
// @connect 10.6.5.75
// @connect 10.6.5.223
// @connect 10.6.5.83
// @connect 10.6.5.13
// @connect 10.6.6.2
// @connect 10.6.5.32
// @connect 10.6.5.2
// @connect 10.6.5.16
// @connect 10.6.5.24
// @connect 10.6.5.14
// @connect 10.6.4.228
// @connect 10.6.4.200
// @connect 10.6.5.224
// @connect 10.6.5.232
// @connect 10.6.5.135
// @connect 10.6.5.206
// @connect 10.6.5.7
// @connect 10.6.5.133
// @connect 10.6.5.140
// @connect 10.6.5.227
// @connect 10.6.5.200
// @connect 10.6.4.204
// @connect 10.6.5.97
// @connect 10.6.5.11
// @connect 10.6.5.85
// @connect 10.6.5.196
// @connect 10.6.5.139
// @connect 10.6.5.225
// @connect 10.6.4.232
// @connect 10.6.5.89
// @connect 10.6.5.220
// @connect 10.6.5.198
// @connect 10.6.5.145
// @connect 10.6.5.102
// @connect 10.6.4.212
// @connect 10.6.5.30
// @connect 10.6.5.161
// @connect 10.6.5.136
// @connect 10.6.5.218
// @connect 10.6.5.88
// @connect 10.6.5.204
// @connect 10.6.5.141
// @connect 10.6.4.222
// @connect 10.6.5.74
// @connect 10.6.0.41
// @connect 10.6.5.147
// @connect 10.6.5.17
// @connect 10.6.5.8
// @connect 10.6.5.132
// @connect 10.6.5.213
// @connect 10.6.5.9
// @connect 10.6.5.31
// @connect 10.6.5.228
// @connect 10.6.4.233
// @connect 10.6.5.92
// @connect 10.6.5.29
// @connect 10.6.5.229
// @connect 10.6.5.100
// @connect 10.6.5.163
// @connect 10.6.5.146
// @connect 10.6.4.207
// @connect 10.6.5.211
// @connect 10.6.5.84
// @connect 10.6.4.218
// @connect 10.6.5.27
// @connect 10.6.5.66
// @connect 10.6.5.94
// @connect 10.6.5.226
// @connect 10.6.5.99
// @connect 10.6.4.231
// @connect 10.6.5.87
// @connect 10.6.5.40
// @connect 10.6.5.91
// @connect 10.6.4.219
// @connect 10.6.5.90
// @connect 10.6.5.157
// @connect 10.6.5.35
// @connect 10.6.5.144
// @connect 10.6.5.42
// @connect 10.6.5.197
// @connect 10.6.5.98
// @connect 10.6.5.38
// @connect 10.6.5.143
// @connect 10.6.5.70
// @connect 10.6.5.34
// @connect 10.6.5.86
// @connect 10.6.4.230
// @connect 10.6.5.67
// @connect 10.6.5.103
// @connect 10.6.5.164
// @connect 10.6.5.154
// @connect 10.6.5.73
// @connect 10.6.5.101
// @connect 10.6.4.221
// @connect 10.6.4.198
// @connect 10.6.5.216
// @connect 10.6.5.131
// @connect 10.6.5.71
// @connect 10.6.4.195
// @connect 10.6.5.19
// @connect 10.6.4.223
// @connect 10.6.4.199
// @connect 10.6.5.41
// @connect 10.6.5.95
// @connect 10.6.5.39
// @connect 10.6.5.138
// @connect 10.6.5.222
// @connect 10.6.5.207
// @connect 10.6.5.153
// @connect 10.6.5.217
// @connect 10.6.5.20
// @connect 10.6.5.162
// @connect 10.6.5.166
// @connect 10.6.5.150
// @connect 10.6.5.221
// @connect 10.6.5.25
// @connect 10.6.4.229
// @connect 10.6.5.233
// @connect 10.6.5.152
// @connect 10.6.41.135
// @connect 10.6.4.216
// @connect 10.6.5.212
// @connect 10.6.5.79
// @connect 10.6.5.202
// @connect 10.6.5.36
// @connect 10.6.5.33
// @connect 10.6.5.104
// @connect 10.6.41.222
// @connect 10.6.5.93
// @connect 10.6.4.206
// @connect 10.6.4.202
// @connect 10.6.4.205
// @connect 10.6.4.203
// @connect 10.6.5.68
// @connect 10.6.5.201
// @connect 10.6.5.77
// @connect 10.6.4.220
// @connect 10.6.4.201
// @connect 10.6.5.81
// @connect 10.6.5.76
// @connect 10.6.5.82
// @connect 10.6.5.156
// @connect 10.6.6.101
// @connect 10.6.6.18
// @connect 10.6.6.41
// @connect 10.6.6.103
// @connect 10.6.6.69
// @connect 10.6.6.67
// @connect 10.6.6.70
// @connect 10.6.6.79
// @connect 10.6.6.72
// @connect 10.6.6.76
// @connect 10.6.34.97
// @connect 10.6.6.93
// @connect 10.6.7.40
// @connect 10.6.6.74
// @connect 10.6.6.25
// @connect 10.6.7.26
// @connect 10.6.6.12
// @connect 10.6.6.14
// @connect 10.6.6.3
// @connect 10.6.6.102
// @connect 10.6.6.21
// @connect 10.6.6.34
// @connect 10.6.6.80
// @connect 10.6.6.77
// @connect 10.6.41.211
// @connect 10.6.6.33
// @connect 10.6.6.151
// @connect 10.6.6.35
// @connect 10.6.6.28
// @connect 10.6.6.19
// @connect 10.6.6.31
// @connect 10.6.6.78
// @connect 10.6.6.90
// @connect 10.6.6.36
// @connect 10.6.6.226
// @connect 10.6.6.96
// @connect 10.6.6.85
// @connect 10.6.6.220
// @connect 10.6.6.211
// @connect 10.6.7.36
// @connect 10.6.6.9
// @connect 10.6.6.92
// @connect 10.6.6.205
// @connect 10.6.6.66
// @connect 10.6.6.133
// @connect 10.6.6.29
// @connect 10.6.6.83
// @connect 10.6.6.214
// @connect 10.6.6.134
// @connect 10.6.7.4
// @connect 10.6.6.88
// @connect 10.6.7.27
// @connect 10.6.6.99
// @connect 10.6.6.216
// @connect 10.6.6.197
// @connect 10.6.6.222
// @connect 10.6.6.22
// @connect 10.6.6.224
// @connect 10.6.6.71
// @connect 10.6.6.221
// @connect 10.6.6.208
// @connect 10.6.7.28
// @connect 10.6.6.39
// @connect 10.6.6.138
// @connect 10.6.6.153
// @connect 10.6.7.5
// @connect 10.6.6.94
// @connect 10.6.7.3
// @connect 10.6.6.212
// @connect 10.6.6.225
// @connect 10.6.7.13
// @connect 10.6.6.73
// @connect 10.6.6.140
// @connect 10.6.6.68
// @connect 10.6.7.9
// @connect 10.6.6.233
// @connect 10.6.7.41
// @connect 10.6.6.159
// @connect 10.6.6.229
// @connect 10.6.6.87
// @connect 10.6.6.11
// @connect 10.6.6.218
// @connect 10.6.6.16
// @connect 10.6.6.82
// @connect 10.6.6.32
// @connect 10.6.6.168
// @connect 10.6.7.82
// @connect 10.6.6.23
// @connect 10.6.6.97
// @connect 10.6.7.16
// @connect 10.6.6.204
// @connect 10.6.6.142
// @connect 10.6.6.144
// @connect 10.6.6.209
// @connect 10.6.6.136
// @connect 10.6.6.30
// @connect 10.6.6.37
// @connect 10.6.6.104
// @connect 10.6.6.141
// @connect 10.6.6.91
// @connect 10.6.6.89
// @connect 10.6.6.139
// @connect 10.6.6.200
// @connect 10.6.6.15
// @connect 10.6.7.70
// @connect 10.6.6.160
// @connect 10.6.6.84
// @connect 10.6.6.199
// @connect 10.6.6.40
// @connect 10.6.7.79
// @connect 10.6.6.207
// @connect 10.6.7.75
// @connect 10.6.7.33
// @connect 10.6.6.17
// @connect 10.6.6.81
// @connect 10.6.6.145
// @connect 10.6.7.72
// @connect 10.6.6.132
// @connect 10.6.6.20
// @connect 10.6.6.131
// @connect 10.6.7.43
// @connect 10.6.6.13
// @connect 10.6.6.149
// @connect 10.6.7.68
// @connect 10.6.6.210
// @connect 10.6.6.38
// @connect 10.6.6.213
// @connect 10.6.6.100
// @connect 10.6.6.163
// @connect 10.6.7.17
// @connect 10.6.7.80
// @connect 10.6.6.143
// @connect 10.6.7.8
// @connect 10.6.6.230
// @connect 10.6.6.196
// @connect 10.6.7.15
// @connect 10.6.6.98
// @connect 10.6.6.158
// @connect 10.6.6.27
// @connect 10.6.6.201
// @connect 10.6.6.161
// @connect 10.6.6.75
// @connect 10.6.6.10
// @connect 10.6.6.86
// @connect 10.6.6.223
// @connect 10.6.7.85
// @connect 10.6.6.164
// @connect 10.6.6.219
// @connect 10.6.6.227
// @connect 10.6.6.135
// @connect 10.6.7.38
// @connect 10.6.6.232
// @connect 10.6.7.34
// @connect 10.6.6.162
// @connect 10.6.7.37
// @connect 10.6.6.137
// @connect 10.6.7.24
// @connect 10.6.6.231
// @connect 10.6.6.206
// @connect 10.6.7.74
// @connect 10.6.7.39
// @connect 10.6.6.198
// @connect 10.6.6.195
// @connect 10.6.6.194
// @connect 10.6.7.6
// @connect 10.6.7.32
// @connect 10.6.6.157
// @connect 10.6.7.20
// @connect 10.6.7.23
// @connect 10.6.7.31
// @connect 10.6.7.29
// @connect 10.6.7.2
// @connect 10.6.6.203
// @connect 10.6.7.21
// @connect 10.6.7.66
// @connect 10.6.6.154
// @connect 10.6.7.19
// @connect 10.6.7.89
// @connect 10.6.7.96
// @connect 10.6.6.228
// @connect 10.6.7.91
// @connect 10.6.6.152
// @connect 10.6.7.30
// @connect 10.6.6.148
// @connect 10.6.6.150
// @connect 10.6.7.100
// @connect 10.6.7.42
// @connect 10.6.7.45
// @connect 10.6.7.105
// @connect 10.6.6.156
// @connect 10.6.6.146
// @connect 10.6.7.46
// @connect 10.6.7.92
// @connect 10.6.7.44
// @connect 10.6.7.97
// @connect 10.6.6.215
// @connect 10.6.7.103
// @connect 10.6.7.94
// @connect 10.6.6.147
// @connect 10.6.7.90
// @connect 10.6.6.167
// @connect 10.6.7.102
// @connect 10.6.6.217
// @connect 10.6.7.67
// @connect 10.6.7.11
// @connect 10.6.6.155
// @connect 10.6.4.234
// @connect 10.6.7.99
// @connect 10.6.7.104
// @connect 10.6.7.101
// @connect 10.6.7.12
// @connect 10.6.7.88
// @connect 10.6.7.98
// @connect 10.6.7.86
// @connect 10.6.7.95
// @connect 10.6.7.81
// @connect 10.6.7.84
// @connect 10.6.7.83
// @connect 10.6.7.93
// @connect 10.6.7.106
// @connect 10.6.7.76
// @connect 10.6.7.71
// @connect 10.6.7.77
// @connect 10.6.7.78
// @connect 10.6.4.131
// @connect 10.6.4.152
// @connect 10.6.4.169
// @connect 10.6.4.171
// @connect 10.6.4.139
// @connect 10.6.4.156
// @connect 10.6.4.146
// @connect 10.6.4.157
// @connect 10.6.4.166
// @connect 10.6.4.148
// @connect 10.6.4.147
// @connect 10.6.4.149
// @connect 10.6.4.165
// @connect 10.6.4.155
// @connect 10.6.4.158
// @connect 10.6.4.138
// @connect 10.6.4.163
// @connect 10.6.4.159
// @connect 10.6.4.133
// @connect 10.6.4.161
// @connect 10.6.4.167
// @connect 10.6.4.145
// @connect 10.6.4.135
// @connect 10.6.4.168
// @connect 10.6.4.140
// @connect 10.6.4.132
// @connect 10.6.4.144
// @connect 10.6.4.136
// @connect 10.6.4.151
// @connect 10.6.4.154
// @connect 10.6.4.164
// @connect 10.6.4.137
// @connect 10.6.4.162
// @connect 10.6.4.143
// @connect 10.6.4.150
// @connect 10.6.4.134
// @connect 10.6.4.160
// @connect 10.6.4.130
// @connect 10.6.16.15
// @connect 10.6.16.5
// @connect 10.6.16.4
// @connect 10.6.16.14
// @connect 10.6.16.20
// @connect 10.6.16.30
// @connect 10.6.16.8
// @connect 10.6.16.11
// @connect 10.6.16.17
// @connect 10.6.16.19
// @connect 10.6.16.16
// @connect 10.6.16.3
// @connect 10.6.16.10
// @connect 10.6.16.26
// @connect 10.6.16.29
// @connect 10.6.16.18
// @connect 10.6.16.24
// @connect 10.6.16.7
// @connect 10.6.16.12
// @connect 10.6.16.21
// @connect 10.6.16.6
// @connect 10.6.16.9
// @connect 10.6.16.23
// @connect 10.6.16.27
// @connect 10.6.16.89
// @connect 10.6.16.2
// @connect 10.6.16.25
// @connect 10.6.16.105
// @connect 10.6.16.68
// @connect 10.6.65.240
// @connect 10.6.16.31
// @connect 10.6.16.92
// @connect 10.6.16.93
// @connect 10.6.16.39
// @connect 10.6.16.35
// @connect 10.6.16.81
// @connect 10.6.16.148
// @connect 10.6.16.97
// @connect 10.6.16.28
// @connect 10.6.16.131
// @connect 10.6.16.101
// @connect 10.6.16.72
// @connect 10.6.16.86
// @connect 10.6.16.133
// @connect 10.6.16.40
// @connect 10.6.16.88
// @connect 10.6.16.13
// @connect 10.6.16.32
// @connect 10.6.16.33
// @connect 10.6.16.76
// @connect 10.6.16.87
// @connect 10.6.16.100
// @connect 10.6.16.74
// @connect 10.6.16.95
// @connect 10.6.16.149
// @connect 10.6.16.134
// @connect 10.6.16.104
// @connect 10.6.16.158
// @connect 10.6.16.66
// @connect 10.6.16.82
// @connect 10.6.16.78
// @connect 10.6.16.75
// @connect 10.6.16.139
// @connect 10.6.16.84
// @connect 10.6.16.132
// @connect 10.6.16.73
// @connect 10.6.16.67
// @connect 10.6.16.77
// @connect 10.6.16.37
// @connect 10.6.16.99
// @connect 10.6.16.70
// @connect 10.6.16.153
// @connect 10.6.16.83
// @connect 10.6.16.79
// @connect 10.6.16.103
// @connect 10.6.16.141
// @connect 10.6.16.143
// @connect 10.6.16.69
// @connect 10.6.16.208
// @connect 10.6.16.155
// @connect 10.6.16.169
// @connect 10.6.16.217
// @connect 10.6.16.85
// @connect 10.6.16.160
// @connect 10.6.16.167
// @connect 10.6.16.222
// @connect 10.6.16.96
// @connect 10.6.16.135
// @connect 10.6.16.38
// @connect 10.6.16.154
// @connect 10.6.16.224
// @connect 10.6.16.71
// @connect 10.6.16.161
// @connect 10.6.16.201
// @connect 10.6.16.147
// @connect 10.6.16.150
// @connect 10.6.16.130
// @connect 10.6.16.210
// @connect 10.6.16.162
// @connect 10.6.16.151
// @connect 10.6.16.216
// @connect 10.6.16.36
// @connect 10.6.16.202
// @connect 10.6.16.164
// @connect 10.6.16.136
// @connect 10.6.16.194
// @connect 10.6.16.140
// @connect 10.6.16.102
// @connect 10.6.16.91
// @connect 10.6.16.145
// @connect 10.6.16.168
// @connect 10.6.16.198
// @connect 10.6.16.142
// @connect 10.6.16.137
// @connect 10.6.16.138
// @connect 10.6.17.134
// @connect 10.6.16.211
// @connect 10.6.16.227
// @connect 10.6.16.80
// @connect 10.6.17.36
// @connect 10.6.16.231
// @connect 10.6.16.215
// @connect 10.6.16.166
// @connect 10.6.16.196
// @connect 10.6.16.156
// @connect 10.6.16.146
// @connect 10.6.17.97
// @connect 10.6.16.226
// @connect 10.6.16.144
// @connect 10.6.16.203
// @connect 10.6.16.212
// @connect 10.6.17.150
// @connect 10.6.17.26
// @connect 10.6.17.200
// @connect 10.6.17.66
// @connect 10.6.16.228
// @connect 10.6.16.219
// @connect 10.6.17.133
// @connect 10.6.17.214
// @connect 10.6.17.209
// @connect 10.6.16.94
// @connect 10.6.16.218
// @connect 10.6.16.223
// @connect 10.6.17.28
// @connect 10.6.16.199
// @connect 10.6.17.13
// @connect 10.6.17.12
// @connect 10.6.16.163
// @connect 10.6.17.196
// @connect 10.6.16.195
// @connect 10.6.17.25
// @connect 10.6.16.152
// @connect 10.6.16.159
// @connect 10.6.17.17
// @connect 10.6.17.130
// @connect 10.6.16.90
// @connect 10.6.16.204
// @connect 10.6.17.212
// @connect 10.6.16.206
// @connect 10.6.17.68
// @connect 10.6.17.89
// @connect 10.6.16.225
// @connect 10.6.16.205
// @connect 10.6.17.168
// @connect 10.6.17.103
// @connect 10.6.16.165
// @connect 10.6.17.199
// @connect 10.6.17.202
// @connect 10.6.17.208
// @connect 10.6.17.158
// @connect 10.6.16.157
// @connect 10.6.17.101
// @connect 10.6.17.69
// @connect 10.6.17.201
// @connect 10.6.17.34
// @connect 10.6.16.221
// @connect 10.6.17.87
// @connect 10.6.17.15
// @connect 10.6.17.82
// @connect 10.6.17.132
// @connect 10.6.17.162
// @connect 10.6.17.92
// @connect 10.6.17.203
// @connect 10.6.17.20
// @connect 10.6.16.197
// @connect 10.6.17.147
// @connect 10.6.17.14
// @connect 10.6.17.148
// @connect 10.6.17.22
// @connect 10.6.16.213
// @connect 10.6.17.194
// @connect 10.6.17.164
// @connect 10.6.17.30
// @connect 10.6.17.70
// @connect 10.6.17.19
// @connect 10.6.17.24
// @connect 10.6.17.135
// @connect 10.6.17.149
// @connect 10.6.17.5
// @connect 10.6.17.102
// @connect 10.6.17.145
// @connect 10.6.17.94
// @connect 10.6.17.216
// @connect 10.6.17.160
// @connect 10.6.16.214
// @connect 10.6.17.213
// @connect 10.6.17.84
// @connect 10.6.17.96
// @connect 10.6.17.146
// @connect 10.6.17.161
// @connect 10.6.17.29
// @connect 10.6.17.79
// @connect 10.6.16.220
// @connect 10.6.17.7
// @connect 10.6.17.204
// @connect 10.6.17.76
// @connect 10.6.17.11
// @connect 10.6.17.210
// @connect 10.6.17.2
// @connect 10.6.17.38
// @connect 10.6.17.167
// @connect 10.6.17.206
// @connect 10.6.17.166
// @connect 10.6.17.131
// @connect 10.6.17.90
// @connect 10.6.17.154
// @connect 10.6.17.37
// @connect 10.6.17.157
// @connect 10.6.17.207
// @connect 10.6.17.86
// @connect 10.6.17.85
// @connect 10.6.17.41
// @connect 10.6.17.100
// @connect 10.6.17.40
// @connect 10.6.17.74
// @connect 10.6.16.200
// @connect 10.6.17.4
// @connect 10.6.17.93
// @connect 10.6.17.219
// @connect 10.6.17.151
// @connect 10.6.17.32
// @connect 10.6.17.77
// @connect 10.6.17.75
// @connect 10.6.17.67
// @connect 10.6.17.31
// @connect 10.6.17.35
// @connect 10.6.17.152
// @connect 10.6.17.95
// @connect 10.6.17.27
// @connect 10.6.16.207
// @connect 10.6.17.80
// @connect 10.6.17.205
// @connect 10.6.17.83
// @connect 10.6.17.99
// @connect 10.6.17.78
// @connect 10.6.17.21
// @connect 10.6.17.81
// @connect 10.6.17.198
// @connect 10.6.17.72
// @connect 10.6.17.215
// @connect 10.6.17.163
// @connect 10.6.17.136
// @connect 10.6.17.10
// @connect 10.6.17.3
// @connect 10.6.17.165
// @connect 10.6.17.138
// @connect 10.6.17.159
// @connect 10.6.17.156
// @connect 10.6.17.217
// @connect 10.6.17.155
// @connect 10.6.17.218
// @connect 10.6.17.18
// @connect 10.6.17.169
// @connect 10.6.17.16
// @connect 10.6.17.8
// @connect 10.6.17.144
// @connect 10.6.17.88
// @connect 10.6.17.197
// @connect 10.6.17.6
// @connect 10.6.17.139
// @connect 10.6.17.137
// @connect 10.6.17.143
// @connect 10.6.17.153
// @connect 10.6.17.220
// @connect 10.6.17.140
// @connect 10.6.17.91
// @connect 10.6.17.71
// @connect 10.6.17.211
// @connect 10.6.17.98
// @connect 10.6.17.141
// @connect 10.6.17.33
// @connect 10.6.17.9
// @connect 10.6.18.132
// @connect 10.6.17.222
// @connect 10.6.18.136
// @connect 10.6.17.228
// @connect 10.6.17.221
// @connect 10.6.17.232
// @connect 10.6.17.227
// @connect 10.6.19.77
// @connect 10.6.18.156
// @connect 10.6.17.230
// @connect 10.6.18.200
// @connect 10.6.18.217
// @connect 10.6.17.226
// @connect 10.6.17.229
// @connect 10.6.19.102
// @connect 10.6.19.74
// @connect 10.6.18.167
// @connect 10.6.18.199
// @connect 10.6.18.216
// @connect 10.6.18.150
// @connect 10.6.19.8
// @connect 10.6.65.25
// @connect 10.6.18.153
// @connect 10.6.19.72
// @connect 10.6.18.228
// @connect 10.6.19.76
// @connect 10.6.18.154
// @connect 10.6.18.151
// @connect 10.6.18.223
// @connect 10.6.18.140
// @connect 10.6.18.208
// @connect 10.6.19.6
// @connect 10.6.18.207
// @connect 10.6.19.24
// @connect 10.6.19.33
// @connect 10.6.18.201
// @connect 10.6.18.215
// @connect 10.6.19.99
// @connect 10.6.18.142
// @connect 10.6.18.205
// @connect 10.6.18.202
// @connect 10.6.18.152
// @connect 10.6.17.224
// @connect 10.6.18.159
// @connect 10.6.18.144
// @connect 10.6.18.211
// @connect 10.6.18.203
// @connect 10.6.18.161
// @connect 10.6.19.79
// @connect 10.6.19.95
// @connect 10.6.18.165
// @connect 10.6.18.148
// @connect 10.6.18.210
// @connect 10.6.19.12
// @connect 10.6.18.145
// @connect 10.6.18.163
// @connect 10.6.18.157
// @connect 10.6.18.169
// @connect 10.6.18.135
// @connect 10.6.18.164
// @connect 10.6.19.69
// @connect 10.6.18.204
// @connect 10.6.19.9
// @connect 10.6.18.158
// @connect 10.6.17.231
// @connect 10.6.19.5
// @connect 10.6.17.223
// @connect 10.6.18.194
// @connect 10.6.18.146
// @connect 10.6.19.81
// @connect 10.6.19.32
// @connect 10.6.19.26
// @connect 10.6.19.91
// @connect 10.6.19.40
// @connect 10.6.19.94
// @connect 10.6.18.196
// @connect 10.6.18.138
// @connect 10.6.18.195
// @connect 10.6.19.84
// @connect 10.6.19.25
// @connect 10.6.19.28
// @connect 10.6.19.38
// @connect 10.6.19.27
// @connect 10.6.18.218
// @connect 10.6.19.10
// @connect 10.6.19.15
// @connect 10.6.19.71
// @connect 10.6.18.141
// @connect 10.6.18.219
// @connect 10.6.19.11
// @connect 10.6.5.137
// @connect 10.6.19.97
// @connect 10.6.18.162
// @connect 10.6.19.20
// @connect 10.6.19.19
// @connect 10.6.19.36
// @connect 10.6.18.226
// @connect 10.6.19.7
// @connect 10.6.60.164
// @connect 10.6.19.78
// @connect 10.6.18.149
// @connect 10.6.18.197
// @connect 10.6.19.14
// @connect 10.6.18.155
// @connect 10.6.19.68
// @connect 10.6.19.41
// @connect 10.6.18.221
// @connect 10.6.18.212
// @connect 10.6.18.160
// @connect 10.6.18.213
// @connect 10.6.18.227
// @connect 10.6.18.137
// @connect 10.6.19.88
// @connect 10.6.18.214
// @connect 10.6.19.3
// @connect 10.6.18.168
// @connect 10.6.18.220
// @connect 10.6.19.75
// @connect 10.6.19.13
// @connect 10.6.18.225
// @connect 10.6.19.92
// @connect 10.6.18.130
// @connect 10.6.19.23
// @connect 10.6.18.133
// @connect 10.6.19.17
// @connect 10.6.18.209
// @connect 10.6.17.225
// @connect 10.6.19.66
// @connect 10.6.19.100
// @connect 10.6.18.131
// @connect 10.6.19.90
// @connect 10.6.19.89
// @connect 10.6.19.30
// @connect 10.6.19.80
// @connect 10.6.19.35
// @connect 10.6.19.82
// @connect 10.6.19.87
// @connect 10.6.19.22
// @connect 10.6.18.222
// @connect 10.6.19.96
// @connect 10.6.19.2
// @connect 10.6.19.101
// @connect 10.6.19.73
// @connect 10.6.19.103
// @connect 10.6.19.37
// @connect 10.6.18.198
// @connect 10.6.18.224
// @connect 10.6.19.98
// @connect 10.6.19.16
// @connect 10.6.19.93
// @connect 10.6.18.134
// @connect 10.6.19.18
// @connect 10.6.18.147
// @connect 10.6.19.4
// @connect 10.6.19.70
// @connect 10.6.19.86
// @connect 10.6.18.230
// @connect 10.6.18.143
// @connect 10.6.18.139
// @connect 10.6.19.83
// @connect 10.6.18.229
// @connect 10.6.18.206
// @connect 10.6.19.85
// @connect 10.6.19.104
// @connect 10.6.19.67
// @connect 10.6.19.105
// @connect 10.6.20.222
// @connect 10.6.20.169
// @connect 10.6.18.233
// @connect 10.6.18.232
// @connect 10.6.16.233
// @connect 10.6.18.81
// @connect 10.6.18.12
// @connect 10.6.18.16
// @connect 10.6.18.35
// @connect 10.6.18.9
// @connect 10.6.16.232
// @connect 10.6.18.3
// @connect 10.6.18.5
// @connect 10.6.18.71
// @connect 10.6.18.85
// @connect 10.6.18.13
// @connect 10.6.18.17
// @connect 10.6.18.8
// @connect 10.6.18.6
// @connect 10.6.18.102
// @connect 10.6.18.105
// @connect 10.6.18.36
// @connect 10.6.18.33
// @connect 10.6.18.23
// @connect 10.6.18.92
// @connect 10.6.18.15
// @connect 10.6.18.89
// @connect 10.6.18.20
// @connect 10.6.18.69
// @connect 10.6.18.40
// @connect 10.6.18.22
// @connect 10.6.18.39
// @connect 10.6.18.21
// @connect 10.6.18.29
// @connect 10.6.18.84
// @connect 10.6.18.76
// @connect 10.6.18.83
// @connect 10.6.18.97
// @connect 10.6.18.88
// @connect 10.6.18.94
// @connect 10.6.18.67
// @connect 10.6.18.96
// @connect 10.6.18.31
// @connect 10.6.18.24
// @connect 10.6.18.98
// @connect 10.6.18.70
// @connect 10.6.18.104
// @connect 10.6.18.25
// @connect 10.6.18.86
// @connect 10.6.18.73
// @connect 10.6.18.95
// @connect 10.6.18.28
// @connect 10.6.16.98
// @connect 10.6.18.66
// @connect 10.6.18.7
// @connect 10.6.18.19
// @connect 10.6.18.99
// @connect 10.6.18.80
// @connect 10.6.18.10
// @connect 10.6.18.103
// @connect 10.6.18.4
// @connect 10.6.18.26
// @connect 10.6.18.18
// @connect 10.6.18.34
// @connect 10.6.18.87
// @connect 10.6.18.38
// @connect 10.6.18.100
// @connect 10.6.18.82
// @connect 10.6.18.90
// @connect 10.6.18.11
// @connect 10.6.18.101
// @connect 10.6.18.37
// @connect 10.6.18.72
// @connect 10.6.18.93
// @connect 10.6.18.74
// @connect 10.6.18.77
// @connect 10.6.18.2
// @connect 10.6.18.91
// @connect 10.6.18.75
// @connect 10.6.18.78
// @connect 10.6.18.79
// @connect 10.6.18.68
// @connect 10.6.18.32
// @connect 10.6.28.12
// @connect 10.6.28.31
// @connect 10.6.28.5
// @connect 10.6.28.15
// @connect 10.6.28.4
// @connect 10.6.28.83
// @connect 10.6.28.26
// @connect 10.6.28.131
// @connect 10.6.28.35
// @connect 10.6.28.148
// @connect 10.6.28.13
// @connect 10.6.28.66
// @connect 10.6.28.9
// @connect 10.6.28.103
// @connect 10.6.28.10
// @connect 10.6.28.30
// @connect 10.6.24.95
// @connect 10.6.28.144
// @connect 10.6.28.41
// @connect 10.6.28.18
// @connect 10.6.28.34
// @connect 10.6.28.21
// @connect 10.6.28.37
// @connect 10.6.28.20
// @connect 10.6.28.69
// @connect 10.6.28.70
// @connect 10.6.28.97
// @connect 10.6.28.93
// @connect 10.6.28.89
// @connect 10.6.28.101
// @connect 10.6.28.16
// @connect 10.6.28.39
// @connect 10.6.28.27
// @connect 10.6.28.134
// @connect 10.6.28.77
// @connect 10.6.28.78
// @connect 10.6.28.136
// @connect 10.6.28.23
// @connect 10.6.28.25
// @connect 10.6.28.90
// @connect 10.6.28.87
// @connect 10.6.28.84
// @connect 10.6.28.29
// @connect 10.6.28.17
// @connect 10.6.28.71
// @connect 10.6.28.38
// @connect 10.6.28.14
// @connect 10.6.28.140
// @connect 10.6.28.79
// @connect 10.6.28.36
// @connect 10.6.28.130
// @connect 10.6.28.6
// @connect 10.6.28.40
// @connect 10.6.28.137
// @connect 10.6.28.147
// @connect 10.6.28.81
// @connect 10.6.28.80
// @connect 10.6.28.105
// @connect 10.6.28.8
// @connect 10.6.28.94
// @connect 10.6.28.33
// @connect 10.6.28.19
// @connect 10.6.28.138
// @connect 10.6.28.133
// @connect 10.6.28.28
// @connect 10.6.28.74
// @connect 10.6.28.7
// @connect 10.6.28.11
// @connect 10.6.28.143
// @connect 10.6.28.22
// @connect 10.6.28.132
// @connect 10.6.28.141
// @connect 10.6.28.75
// @connect 10.6.28.135
// @connect 10.6.28.95
// @connect 10.6.28.67
// @connect 10.6.28.142
// @connect 10.6.28.139
// @connect 10.6.28.72
// @connect 10.6.28.104
// @connect 10.6.28.100
// @connect 10.6.28.92
// @connect 10.6.28.24
// @connect 10.6.28.68
// @connect 10.6.28.88
// @connect 10.6.28.149
// @connect 10.6.28.2
// @connect 10.6.28.96
// @connect 10.6.28.73
// @connect 10.6.28.86
// @connect 10.6.28.3
// @connect 10.6.28.91
// @connect 10.6.28.146
// @connect 10.6.28.85
// @connect 10.6.28.99
// @connect 10.6.28.82
// @connect 10.6.28.76
// @connect 10.6.28.145
// @connect 10.6.29.135
// @connect 10.6.28.162
// @connect 10.6.29.79
// @connect 10.6.28.153
// @connect 10.6.28.156
// @connect 10.6.29.102
// @connect 10.6.29.72
// @connect 10.6.28.220
// @connect 10.6.29.142
// @connect 10.6.29.29
// @connect 10.6.28.155
// @connect 10.6.29.69
// @connect 10.6.29.4
// @connect 10.6.28.204
// @connect 10.6.28.167
// @connect 10.6.29.90
// @connect 10.6.28.205
// @connect 10.6.29.24
// @connect 10.6.29.30
// @connect 10.6.28.216
// @connect 10.6.29.16
// @connect 10.6.28.160
// @connect 10.6.29.137
// @connect 10.6.29.74
// @connect 10.6.29.17
// @connect 10.6.28.233
// @connect 10.6.29.88
// @connect 10.6.28.217
// @connect 10.6.29.95
// @connect 10.6.29.19
// @connect 10.6.28.224
// @connect 10.6.29.28
// @connect 10.6.29.26
// @connect 10.6.29.14
// @connect 10.6.29.20
// @connect 10.6.29.76
// @connect 10.6.29.6
// @connect 10.6.29.93
// @connect 10.6.29.77
// @connect 10.6.28.166
// @connect 10.6.28.199
// @connect 10.6.28.195
// @connect 10.6.28.152
// @connect 10.6.28.228
// @connect 10.6.29.31
// @connect 10.6.28.214
// @connect 10.6.28.227
// @connect 10.6.29.98
// @connect 10.6.29.82
// @connect 10.6.29.91
// @connect 10.6.29.71
// @connect 10.6.28.150
// @connect 10.6.29.12
// @connect 10.6.28.164
// @connect 10.6.29.144
// @connect 10.6.29.94
// @connect 10.6.28.161
// @connect 10.6.29.143
// @connect 10.6.29.68
// @connect 10.6.29.66
// @connect 10.6.28.157
// @connect 10.6.29.9
// @connect 10.6.28.158
// @connect 10.6.29.83
// @connect 10.6.29.73
// @connect 10.6.52.194
// @connect 10.6.29.35
// @connect 10.6.28.207
// @connect 10.6.29.78
// @connect 10.6.29.147
// @connect 10.6.29.81
// @connect 10.6.29.86
// @connect 10.6.29.33
// @connect 10.6.28.219
// @connect 10.6.29.84
// @connect 10.6.29.105
// @connect 10.6.29.25
// @connect 10.6.29.133
// @connect 10.6.29.103
// @connect 10.6.29.67
// @connect 10.6.28.223
// @connect 10.6.29.70
// @connect 10.6.28.221
// @connect 10.6.29.139
// @connect 10.6.28.196
// @connect 10.6.28.165
// @connect 10.6.29.21
// @connect 10.6.28.218
// @connect 10.6.29.132
// @connect 10.6.29.10
// @connect 10.6.29.136
// @connect 10.6.28.209
// @connect 10.6.29.141
// @connect 10.6.29.23
// @connect 10.6.29.3
// @connect 10.6.28.154
// @connect 10.6.28.208
// @connect 10.6.28.159
// @connect 10.6.29.104
// @connect 10.6.29.40
// @connect 10.6.28.163
// @connect 10.6.29.151
// @connect 10.6.28.229
// @connect 10.6.28.225
// @connect 10.6.29.148
// @connect 10.6.29.138
// @connect 10.6.29.134
// @connect 10.6.29.80
// @connect 10.6.29.152
// @connect 10.6.29.22
// @connect 10.6.29.75
// @connect 10.6.29.13
// @connect 10.6.29.27
// @connect 10.6.28.210
// @connect 10.6.28.206
// @connect 10.6.29.37
// @connect 10.6.28.194
// @connect 10.6.29.39
// @connect 10.6.29.140
// @connect 10.6.29.149
// @connect 10.6.28.198
// @connect 10.6.29.32
// @connect 10.6.28.197
// @connect 10.6.29.8
// @connect 10.6.28.215
// @connect 10.6.28.213
// @connect 10.6.28.200
// @connect 10.6.29.15
// @connect 10.6.28.230
// @connect 10.6.29.146
// @connect 10.6.29.97
// @connect 10.6.29.18
// @connect 10.6.28.212
// @connect 10.6.28.226
// @connect 10.6.29.11
// @connect 10.6.29.99
// @connect 10.6.29.89
// @connect 10.6.29.101
// @connect 10.6.29.41
// @connect 10.6.28.211
// @connect 10.6.29.5
// @connect 10.6.29.34
// @connect 10.6.28.202
// @connect 10.6.29.130
// @connect 10.6.28.203
// @connect 10.6.29.131
// @connect 10.6.29.100
// @connect 10.6.28.151
// @connect 10.6.29.96
// @connect 10.6.28.201
// @connect 10.6.29.87
// @connect 10.6.28.222
// @connect 10.6.29.36
// @connect 10.6.29.2
// @connect 10.6.29.92
// @connect 10.6.29.145
// @connect 10.6.29.150
// @connect 10.6.29.208
// @connect 10.6.29.196
// @connect 10.6.29.166
// @connect 10.6.29.203
// @connect 10.6.29.204
// @connect 10.6.29.197
// @connect 10.6.29.153
// @connect 10.6.29.200
// @connect 10.6.29.160
// @connect 10.6.29.154
// @connect 10.6.29.214
// @connect 10.6.29.223
// @connect 10.6.29.212
// @connect 10.6.30.11
// @connect 10.6.29.198
// @connect 10.6.30.21
// @connect 10.6.29.162
// @connect 10.6.29.164
// @connect 10.6.30.36
// @connect 10.6.30.15
// @connect 10.6.30.14
// @connect 10.6.41.150
// @connect 10.6.30.3
// @connect 10.6.30.83
// @connect 10.6.29.159
// @connect 10.6.29.225
// @connect 10.6.30.4
// @connect 10.6.30.70
// @connect 10.6.30.69
// @connect 10.6.29.231
// @connect 10.6.30.22
// @connect 10.6.30.38
// @connect 10.6.30.88
// @connect 10.6.30.30
// @connect 10.6.30.17
// @connect 10.6.30.94
// @connect 10.6.30.6
// @connect 10.6.29.205
// @connect 10.6.30.25
// @connect 10.6.30.100
// @connect 10.6.30.41
// @connect 10.6.30.34
// @connect 10.6.30.167
// @connect 10.6.30.71
// @connect 10.6.29.216
// @connect 10.6.29.161
// @connect 10.6.29.207
// @connect 10.6.29.210
// @connect 10.6.30.80
// @connect 10.6.30.130
// @connect 10.6.30.78
// @connect 10.6.29.221
// @connect 10.6.30.82
// @connect 10.6.30.85
// @connect 10.6.30.136
// @connect 10.6.30.12
// @connect 10.6.30.87
// @connect 10.6.30.131
// @connect 10.6.29.222
// @connect 10.6.30.140
// @connect 10.6.29.219
// @connect 10.6.29.165
// @connect 10.6.30.150
// @connect 10.6.29.213
// @connect 10.6.29.226
// @connect 10.6.29.224
// @connect 10.6.30.72
// @connect 10.6.30.5
// @connect 10.6.29.157
// @connect 10.6.29.211
// @connect 10.6.30.13
// @connect 10.6.30.103
// @connect 10.6.30.10
// @connect 10.6.30.16
// @connect 10.6.30.105
// @connect 10.6.29.218
// @connect 10.6.30.23
// @connect 10.6.30.89
// @connect 10.6.30.81
// @connect 10.6.30.7
// @connect 10.6.30.19
// @connect 10.6.30.18
// @connect 10.6.30.29
// @connect 10.6.29.228
// @connect 10.6.29.206
// @connect 10.6.29.195
// @connect 10.6.29.201
// @connect 10.6.30.8
// @connect 10.6.30.74
// @connect 10.6.29.163
// @connect 10.6.30.66
// @connect 10.6.29.220
// @connect 10.6.29.232
// @connect 10.6.30.68
// @connect 10.6.29.194
// @connect 10.6.30.27
// @connect 10.6.29.199
// @connect 10.6.30.133
// @connect 10.6.30.92
// @connect 10.6.29.229
// @connect 10.6.29.209
// @connect 10.6.30.37
// @connect 10.6.29.156
// @connect 10.6.29.215
// @connect 10.6.30.165
// @connect 10.6.30.163
// @connect 10.6.29.155
// @connect 10.6.30.99
// @connect 10.6.30.149
// @connect 10.6.30.35
// @connect 10.6.30.76
// @connect 10.6.30.79
// @connect 10.6.30.2
// @connect 10.6.30.24
// @connect 10.6.30.135
// @connect 10.6.29.167
// @connect 10.6.30.152
// @connect 10.6.30.33
// @connect 10.6.30.39
// @connect 10.6.30.31
// @connect 10.6.30.153
// @connect 10.6.30.97
// @connect 10.6.30.101
// @connect 10.6.30.157
// @connect 10.6.30.86
// @connect 10.6.30.32
// @connect 10.6.30.151
// @connect 10.6.29.233
// @connect 10.6.30.91
// @connect 10.6.30.77
// @connect 10.6.30.67
// @connect 10.6.30.162
// @connect 10.6.29.169
// @connect 10.6.29.168
// @connect 10.6.30.95
// @connect 10.6.30.75
// @connect 10.6.30.142
// @connect 10.6.30.143
// @connect 10.6.30.147
// @connect 10.6.30.138
// @connect 10.6.30.169
// @connect 10.6.30.159
// @connect 10.6.30.96
// @connect 10.6.30.28
// @connect 10.6.30.141
// @connect 10.6.30.98
// @connect 10.6.30.20
// @connect 10.6.30.154
// @connect 10.6.30.137
// @connect 10.6.30.93
// @connect 10.6.30.146
// @connect 10.6.30.26
// @connect 10.6.30.102
// @connect 10.6.30.139
// @connect 10.6.30.73
// @connect 10.6.30.145
// @connect 10.6.30.132
// @connect 10.6.30.164
// @connect 10.6.30.84
// @connect 10.6.30.134
// @connect 10.6.30.148
// @connect 10.6.30.156
// @connect 10.6.30.155
// @connect 10.6.30.166
// @connect 10.6.30.158
// @connect 10.6.30.168
// @connect 10.6.30.104
// @connect 10.6.30.161
// @connect 10.6.30.199
// @connect 10.6.30.220
// @connect 10.6.30.207
// @connect 10.6.30.219
// @connect 10.6.30.211
// @connect 10.6.30.202
// @connect 10.6.30.197
// @connect 10.6.30.210
// @connect 10.6.30.231
// @connect 10.6.30.204
// @connect 10.6.30.216
// @connect 10.6.30.201
// @connect 10.6.30.196
// @connect 10.6.31.3
// @connect 10.6.30.198
// @connect 10.6.30.212
// @connect 10.6.30.195
// @connect 10.6.30.230
// @connect 10.6.31.14
// @connect 10.6.30.218
// @connect 10.6.31.13
// @connect 10.6.30.203
// @connect 10.6.30.208
// @connect 10.6.30.229
// @connect 10.6.31.15
// @connect 10.6.31.21
// @connect 10.6.30.215
// @connect 10.6.31.67
// @connect 10.6.31.11
// @connect 10.6.30.221
// @connect 10.6.31.4
// @connect 10.6.31.25
// @connect 10.6.30.222
// @connect 10.6.30.213
// @connect 10.6.31.35
// @connect 10.6.30.200
// @connect 10.6.30.206
// @connect 10.6.31.37
// @connect 10.6.31.5
// @connect 10.6.31.17
// @connect 10.6.31.7
// @connect 10.6.31.34
// @connect 10.6.30.194
// @connect 10.6.30.225
// @connect 10.6.31.22
// @connect 10.6.31.26
// @connect 10.6.30.144
// @connect 10.6.31.23
// @connect 10.6.31.30
// @connect 10.6.31.24
// @connect 10.6.31.10
// @connect 10.6.30.209
// @connect 10.6.31.71
// @connect 10.6.31.74
// @connect 10.6.30.226
// @connect 10.6.31.6
// @connect 10.6.30.223
// @connect 10.6.31.2
// @connect 10.6.31.33
// @connect 10.6.31.70
// @connect 10.6.31.28
// @connect 10.6.31.68
// @connect 10.6.31.32
// @connect 10.6.31.8
// @connect 10.6.31.76
// @connect 10.6.31.83
// @connect 10.6.31.69
// @connect 10.6.30.228
// @connect 10.6.31.82
// @connect 10.6.30.227
// @connect 10.6.30.217
// @connect 10.6.30.233
// @connect 10.6.31.27
// @connect 10.6.30.205
// @connect 10.6.31.12
// @connect 10.6.31.40
// @connect 10.6.30.224
// @connect 10.6.31.38
// @connect 10.6.31.19
// @connect 10.6.31.20
// @connect 10.6.31.89
// @connect 10.6.31.96
// @connect 10.6.31.90
// @connect 10.6.31.41
// @connect 10.6.31.88
// @connect 10.6.31.75
// @connect 10.6.31.86
// @connect 10.6.31.36
// @connect 10.6.31.103
// @connect 10.6.31.9
// @connect 10.6.31.84
// @connect 10.6.31.18
// @connect 10.6.31.29
// @connect 10.6.31.81
// @connect 10.6.31.31
// @connect 10.6.31.100
// @connect 10.6.31.72
// @connect 10.6.31.99
// @connect 10.6.31.78
// @connect 10.6.31.87
// @connect 10.6.31.80
// @connect 10.6.31.16
// @connect 10.6.31.77
// @connect 10.6.31.93
// @connect 10.6.31.104
// @connect 10.6.31.94
// @connect 10.6.30.232
// @connect 10.6.31.85
// @connect 10.6.31.98
// @connect 10.6.31.66
// @connect 10.6.31.101
// @connect 10.6.31.91
// @connect 10.6.31.92
// @connect 10.6.31.95
// @connect 10.6.31.105
// @connect 10.6.31.73
// @connect 10.6.31.79
// @connect 10.6.31.97
// @connect 10.6.8.169
// @connect 10.6.17.105
// @connect 10.6.30.40
// @connect 10.6.18.41
// @connect 10.6.17.233
// @connect 10.6.24.105
// @connect 10.6.26.41
// @connect 10.6.7.7
// @connect 10.6.28.168
// @connect 10.6.4.35
// @connect 10.6.8.233
// @connect 10.6.12.169
// @connect 10.6.9.233
// @connect 10.6.26.105
// @connect 10.6.56.8
// @connect 10.6.56.228
// @connect 10.6.57.32
// @connect 10.6.56.224
// @connect 10.6.57.102
// @connect 10.6.57.162
// @connect 10.6.57.159
// @connect 10.6.58.68
// @connect 10.6.58.27
// @connect 10.6.58.220
// @connect 10.6.59.73
// @connect 10.6.59.81
// @connect 10.6.60.157
// @connect 10.6.61.22
// @connect 10.6.61.15
// @connect 10.6.62.22
// @connect 10.6.62.8
// @connect 10.6.61.85
// @connect 10.6.62.86
// @connect 10.6.62.157
// @connect 10.6.63.22
// @connect 10.6.63.94
// @connect 10.6.64.28
// @connect 10.6.64.59
// @connect 10.6.64.114
// @connect 10.6.65.27
// @connect 10.6.65.20
// @connect 10.6.65.89
// @connect 10.6.65.231
// @connect 10.6.65.114
// @connect 10.6.65.192
// @connect 10.6.34.194
// @connect 10.6.35.41
// @connect 10.6.44.221
// @connect 10.6.45.213
// @connect 10.6.44.76
// @connect 10.6.46.21
// @connect 10.6.46.11
// @connect 10.6.46.80
// @connect 10.6.52.3
// @connect 10.6.53.168
// @connect 10.6.52.224
// @connect 10.6.54.168
// @connect 10.6.54.41
// @connect 10.6.55.14
// @connect 10.6.54.102
// @connect 10.6.55.26
// @connect 10.6.55.42
// @connect 10.6.55.95
// @connect 10.6.41.6
// @connect 10.6.40.102
// @connect 10.6.43.103
// @connect 10.6.6.166
// @connect 10.6.28.98
// @connect 10.6.41.74
// @connect 10.6.41.163
// @connect 10.6.40.233
// @connect 10.6.34.206
// @connect 10.6.61.105
// @connect 10.6.65.215
// @connect 10.6.56.97
// @connect 10.6.46.229
// @connect 10.6.34.220
// @connect 10.6.34.12
// @connect 10.6.14.161
// @connect 10.6.32.131
// @connect 10.6.33.33
// @connect 10.6.32.146
// @connect 10.6.32.156
// @connect 10.6.32.14
// @connect 10.6.24.76
// @connect 10.6.30.160
// @connect 10.6.29.85
// @connect 10.6.25.131
// @connect 10.6.68.162
// @connect 10.6.34.42
// @connect 10.6.23.88
// @connect 10.6.29.227
// @connect 10.6.27.2
// @connect 10.6.22.28
// @connect 10.6.68.169
// @connect 10.6.69.186
// @connect 10.6.69.227
// @connect 10.6.69.237
// @connect 10.6.70.24
// @connect 10.6.73.213
// @connect 10.6.74.49
// @connect 10.6.6.130
// @connect 10.6.8.199
// @connect 10.6.62.233
// @connect 10.6.72.117
// @connect 10.6.68.176
// @connect 10.6.2.19
// @connect 10.6.0.196
// @connect 10.6.2.18
// @connect 10.6.1.130
// @connect 10.6.2.27
// @connect 10.6.0.138
// @connect 10.6.1.3
// @connect 10.6.2.22
// @connect 10.6.2.69
// @connect 10.6.41.146
// @connect 10.6.2.166
// @connect 10.6.3.16
// @connect 10.6.6.202
// @connect 10.6.4.66
// @connect 10.6.4.38
// @connect 10.6.6.165
// @connect 10.6.7.10
// @connect 10.6.6.169
// @connect 10.6.4.142
// @connect 10.6.7.69
// @connect 10.6.8.143
// @connect 10.6.8.38
// @connect 10.6.8.195
// @connect 10.6.9.77
// @connect 10.6.6.105
// @connect 10.6.62.165
// @connect 10.6.62.135
// @connect 10.6.68.186
// @connect 10.6.73.18
// @connect 10.6.73.219
// @connect 10.6.64.78
// @connect 10.6.64.155
// @connect 10.6.65.2
// @connect 10.6.65.59
// @connect 10.6.65.102
// @connect 10.6.65.220
// @connect 10.6.65.251
// @connect 10.6.64.228
// @connect 10.6.66.2
// @connect 10.6.66.3
// @connect 10.6.62.24
// @connect 10.6.61.200
// @connect 10.6.62.94
// @connect 10.6.62.105
// @connect 10.6.62.131
// @connect 10.6.63.24
// @connect 10.6.56.102
// @connect 10.6.56.200
// @connect 10.6.58.71
// @connect 10.6.58.31
// @connect 10.6.57.145
// @connect 10.6.59.20
// @connect 10.6.59.5
// @connect 10.6.59.106
// @connect 10.6.59.91
// @connect 10.6.59.13
// @connect 10.6.58.156
// @connect 10.6.58.101
// @connect 10.6.53.38
// @connect 10.6.53.68
// @connect 10.6.53.232
// @connect 10.6.54.29
// @connect 10.6.44.156
// @connect 10.6.45.196
// @connect 10.6.40.230
// @connect 10.6.40.91
// @connect 10.6.16.22
// @connect 10.6.68.188
// @connect 10.6.68.191
// @connect 10.6.42.219
// @connect 10.6.52.76
// @connect 10.6.42.224
// @connect 10.6.42.220
// @connect 10.6.42.226
// @connect 10.6.43.78
// @connect 10.6.42.82
// @connect 10.6.42.152
// @connect 10.6.42.40
// @connect 10.6.42.166
// @connect 10.6.42.103
// @connect 10.6.42.228
// @connect 10.6.13.170
// @connect 10.6.42.232
// @connect 10.6.43.41
// @connect 10.6.43.37
// @connect 10.6.42.227
// @connect 10.6.42.230
// @connect 10.6.43.39
// @connect 10.6.34.13
// @connect 10.6.34.43
// @connect 10.6.33.233
// @connect 10.6.34.38
// @connect 10.6.41.219
// @connect 10.6.33.232
// @connect 10.6.34.39
// @connect 10.6.68.144
// @connect 10.6.42.234
// @connect 10.6.36.99
// @connect 10.6.36.130
// @connect 10.6.36.100
// @connect 10.6.36.27
// @connect 10.6.36.70
// @connect 10.6.36.96
// @connect 10.6.36.139
// @connect 10.6.36.150
// @connect 10.6.36.15
// @connect 10.6.36.40
// @connect 10.6.36.143
// @connect 10.6.36.23
// @connect 10.6.36.136
// @connect 10.6.36.91
// @connect 10.6.36.78
// @connect 10.6.36.19
// @connect 10.6.36.157
// @connect 10.6.36.29
// @connect 10.6.36.137
// @connect 10.6.36.105
// @connect 10.6.36.75
// @connect 10.6.36.71
// @connect 10.6.36.33
// @connect 10.6.36.90
// @connect 10.6.36.156
// @connect 10.6.36.16
// @connect 10.6.36.28
// @connect 10.6.36.81
// @connect 10.6.36.21
// @connect 10.6.36.68
// @connect 10.6.36.69
// @connect 10.6.36.76
// @connect 10.6.36.142
// @connect 10.6.36.86
// @connect 10.6.36.131
// @connect 10.6.36.66
// @connect 10.6.36.132
// @connect 10.6.36.138
// @connect 10.6.36.83
// @connect 10.6.36.17
// @connect 10.6.36.20
// @connect 10.6.36.133
// @connect 10.6.36.73
// @connect 10.6.36.82
// @connect 10.6.36.85
// @connect 10.6.36.13
// @connect 10.6.36.37
// @connect 10.6.36.31
// @connect 10.6.36.104
// @connect 10.6.36.67
// @connect 10.6.36.11
// @connect 10.6.36.10
// @connect 10.6.36.89
// @connect 10.6.36.87
// @connect 10.6.36.95
// @connect 10.6.36.14
// @connect 10.6.36.88
// @connect 10.6.36.77
// @connect 10.6.36.26
// @connect 10.6.36.153
// @connect 10.6.36.93
// @connect 10.6.36.141
// @connect 10.6.36.101
// @connect 10.6.36.154
// @connect 10.6.36.151
// @connect 10.6.36.30
// @connect 10.6.36.145
// @connect 10.6.36.25
// @connect 10.6.36.84
// @connect 10.6.36.80
// @connect 10.6.36.79
// @connect 10.6.36.41
// @connect 10.6.36.74
// @connect 10.6.36.155
// @connect 10.6.36.38
// @connect 10.6.36.147
// @connect 10.6.36.148
// @connect 10.6.36.98
// @connect 10.6.36.144
// @connect 10.6.36.72
// @connect 10.6.36.22
// @connect 10.6.36.36
// @connect 10.6.36.97
// @connect 10.6.36.149
// @connect 10.6.36.24
// @connect 10.6.36.103
// @connect 10.6.36.140
// @connect 10.6.36.146
// @connect 10.6.36.32
// @connect 10.6.36.35
// @connect 10.6.36.135
// @connect 10.6.36.18
// @connect 10.6.36.102
// @connect 10.6.36.39
// @connect 10.6.36.12
// @connect 10.6.36.134
// @connect 10.6.36.34
// @connect 10.6.36.92
// @connect 10.6.68.198
// @connect 10.6.36.204
// @connect 10.6.36.202
// @connect 10.6.51.2
// @connect 10.6.51.9
// @connect 10.6.51.4
// @connect 10.6.36.205
// @connect 10.6.51.8
// @connect 10.6.37.97
// @connect 10.6.36.169
// @connect 10.6.36.168
// @connect 10.6.36.166
// @connect 10.6.36.165
// @connect 10.6.36.163
// @connect 10.6.36.160
// @connect 10.6.36.164
// @connect 10.6.36.159
// @connect 10.6.36.170
// @connect 10.6.36.203
// @connect 10.6.51.3
// @connect 10.6.36.158
// @connect 10.6.51.5
// @connect 10.6.51.6
// @connect 10.6.36.162
// @connect 10.6.51.7
// @connect 10.6.36.215
// @connect 10.6.36.211
// @connect 10.6.36.216
// @connect 10.6.36.217
// @connect 10.6.36.218
// @connect 10.6.36.195
// @connect 10.6.36.214
// @connect 10.6.36.210
// @connect 10.6.36.207
// @connect 10.6.36.212
// @connect 10.6.36.208
// @connect 10.6.36.206
// @connect 10.6.36.213
// @connect 10.6.36.219
// @connect 10.6.36.229
// @connect 10.6.36.226
// @connect 10.6.36.223
// @connect 10.6.36.224
// @connect 10.6.36.231
// @connect 10.6.36.232
// @connect 10.6.36.227
// @connect 10.6.36.225
// @connect 10.6.36.233
// @connect 10.6.36.228
// @connect 10.6.36.221
// @connect 10.6.36.220
// @connect 10.6.36.194
// @connect 10.6.37.14
// @connect 10.6.37.2
// @connect 10.6.37.79
// @connect 10.6.37.26
// @connect 10.6.37.70
// @connect 10.6.37.69
// @connect 10.6.37.20
// @connect 10.6.37.18
// @connect 10.6.37.33
// @connect 10.6.37.24
// @connect 10.6.37.5
// @connect 10.6.37.36
// @connect 10.6.37.25
// @connect 10.6.37.13
// @connect 10.6.37.78
// @connect 10.6.37.77
// @connect 10.6.37.34
// @connect 10.6.37.32
// @connect 10.6.37.81
// @connect 10.6.37.12
// @connect 10.6.37.23
// @connect 10.6.37.72
// @connect 10.6.37.35
// @connect 10.6.37.21
// @connect 10.6.37.6
// @connect 10.6.37.15
// @connect 10.6.37.3
// @connect 10.6.37.30
// @connect 10.6.37.67
// @connect 10.6.37.76
// @connect 10.6.37.28
// @connect 10.6.37.73
// @connect 10.6.37.16
// @connect 10.6.37.29
// @connect 10.6.37.40
// @connect 10.6.37.37
// @connect 10.6.37.27
// @connect 10.6.37.41
// @connect 10.6.37.8
// @connect 10.6.37.38
// @connect 10.6.37.39
// @connect 10.6.37.19
// @connect 10.6.37.71
// @connect 10.6.37.10
// @connect 10.6.37.9
// @connect 10.6.37.75
// @connect 10.6.37.7
// @connect 10.6.37.11
// @connect 10.6.37.17
// @connect 10.6.37.22
// @connect 10.6.37.4
// @connect 10.6.37.74
// @connect 10.6.37.68
// @connect 10.6.37.31
// @connect 10.6.37.66
// @connect 10.6.62.143
// @connect 10.6.68.216
// @connect 10.6.68.165
// @connect 10.6.68.154
// @connect 10.6.68.183
// @connect 10.6.68.156
// @connect 10.6.37.80
// @connect 10.6.37.89
// @connect 10.6.37.102
// @connect 10.6.37.87
// @connect 10.6.37.85
// @connect 10.6.37.100
// @connect 10.6.37.82
// @connect 10.6.37.98
// @connect 10.6.37.90
// @connect 10.6.36.4
// @connect 10.6.37.91
// @connect 10.6.37.103
// @connect 10.6.37.92
// @connect 10.6.37.101
// @connect 10.6.37.93
// @connect 10.6.37.83
// @connect 10.6.37.86
// @connect 10.6.37.95
// @connect 10.6.37.94
// @connect 10.6.37.99
// @connect 10.6.37.104
// @connect 10.6.37.96
// @connect 10.6.37.88
// @connect 10.6.37.84
// @connect 10.6.37.141
// @connect 10.6.37.139
// @connect 10.6.37.167
// @connect 10.6.37.152
// @connect 10.6.37.150
// @connect 10.6.37.165
// @connect 10.6.37.154
// @connect 10.6.37.134
// @connect 10.6.37.147
// @connect 10.6.37.136
// @connect 10.6.37.151
// @connect 10.6.37.156
// @connect 10.6.37.131
// @connect 10.6.37.146
// @connect 10.6.37.166
// @connect 10.6.37.140
// @connect 10.6.37.160
// @connect 10.6.37.148
// @connect 10.6.37.162
// @connect 10.6.37.161
// @connect 10.6.37.144
// @connect 10.6.37.137
// @connect 10.6.37.168
// @connect 10.6.37.153
// @connect 10.6.37.164
// @connect 10.6.37.149
// @connect 10.6.37.133
// @connect 10.6.37.159
// @connect 10.6.37.155
// @connect 10.6.37.157
// @connect 10.6.37.169
// @connect 10.6.37.145
// @connect 10.6.37.143
// @connect 10.6.37.138
// @connect 10.6.37.130
// @connect 10.6.37.142
// @connect 10.6.37.135
// @connect 10.6.37.163
// @connect 10.6.37.132
// @connect 10.6.37.158
// @connect 10.6.37.105
// @connect 10.6.37.221
// @connect 10.6.37.226
// @connect 10.6.37.214
// @connect 10.6.37.217
// @connect 10.6.37.196
// @connect 10.6.38.15
// @connect 10.6.37.210
// @connect 10.6.38.3
// @connect 10.6.37.227
// @connect 10.6.38.4
// @connect 10.6.37.206
// @connect 10.6.38.12
// @connect 10.6.38.13
// @connect 10.6.38.10
// @connect 10.6.37.211
// @connect 10.6.38.31
// @connect 10.6.37.224
// @connect 10.6.38.16
// @connect 10.6.37.203
// @connect 10.6.37.207
// @connect 10.6.37.219
// @connect 10.6.37.195
// @connect 10.6.37.232
// @connect 10.6.38.8
// @connect 10.6.38.2
// @connect 10.6.37.200
// @connect 10.6.38.20
// @connect 10.6.37.197
// @connect 10.6.37.205
// @connect 10.6.38.23
// @connect 10.6.38.24
// @connect 10.6.37.223
// @connect 10.6.38.17
// @connect 10.6.38.14
// @connect 10.6.38.7
// @connect 10.6.38.37
// @connect 10.6.37.199
// @connect 10.6.37.230
// @connect 10.6.37.215
// @connect 10.6.38.6
// @connect 10.6.37.209
// @connect 10.6.38.18
// @connect 10.6.37.225
// @connect 10.6.37.198
// @connect 10.6.37.231
// @connect 10.6.37.204
// @connect 10.6.37.194
// @connect 10.6.37.228
// @connect 10.6.38.11
// @connect 10.6.37.218
// @connect 10.6.38.19
// @connect 10.6.38.36
// @connect 10.6.38.28
// @connect 10.6.37.229
// @connect 10.6.38.30
// @connect 10.6.38.25
// @connect 10.6.38.9
// @connect 10.6.37.216
// @connect 10.6.37.213
// @connect 10.6.37.212
// @connect 10.6.37.208
// @connect 10.6.38.29
// @connect 10.6.38.35
// @connect 10.6.37.220
// @connect 10.6.37.201
// @connect 10.6.38.21
// @connect 10.6.38.34
// @connect 10.6.38.5
// @connect 10.6.38.40
// @connect 10.6.38.39
// @connect 10.6.38.41
// @connect 10.6.38.27
// @connect 10.6.37.202
// @connect 10.6.38.32
// @connect 10.6.38.22
// @connect 10.6.38.33
// @connect 10.6.38.26
// @connect 10.6.38.38
// @connect 10.6.37.222
// @connect 10.6.38.74
// @connect 10.6.38.78
// @connect 10.6.38.75
// @connect 10.6.38.68
// @connect 10.6.38.87
// @connect 10.6.38.77
// @connect 10.6.38.70
// @connect 10.6.38.67
// @connect 10.6.38.79
// @connect 10.6.38.71
// @connect 10.6.38.72
// @connect 10.6.38.73
// @connect 10.6.38.69
// @connect 10.6.38.76
// @connect 10.6.38.66
// @connect 10.6.38.97
// @connect 10.6.51.17
// @connect 10.6.38.84
// @connect 10.6.38.137
// @connect 10.6.38.86
// @connect 10.6.38.95
// @connect 10.6.51.10
// @connect 10.6.51.11
// @connect 10.6.38.82
// @connect 10.6.38.90
// @connect 10.6.38.96
// @connect 10.6.38.136
// @connect 10.6.38.80
// @connect 10.6.51.12
// @connect 10.6.38.83
// @connect 10.6.38.92
// @connect 10.6.38.91
// @connect 10.6.38.158
// @connect 10.6.38.93
// @connect 10.6.38.132
// @connect 10.6.38.81
// @connect 10.6.38.156
// @connect 10.6.38.147
// @connect 10.6.38.157
// @connect 10.6.38.153
// @connect 10.6.38.145
// @connect 10.6.38.152
// @connect 10.6.51.14
// @connect 10.6.38.133
// @connect 10.6.38.140
// @connect 10.6.38.89
// @connect 10.6.38.141
// @connect 10.6.38.159
// @connect 10.6.38.135
// @connect 10.6.38.154
// @connect 10.6.38.150
// @connect 10.6.38.131
// @connect 10.6.51.13
// @connect 10.6.38.94
// @connect 10.6.38.160
// @connect 10.6.38.143
// @connect 10.6.38.88
// @connect 10.6.51.15
// @connect 10.6.51.16
// @connect 10.6.38.148
// @connect 10.6.38.151
// @connect 10.6.38.155
// @connect 10.6.38.149
// @connect 10.6.38.142
// @connect 10.6.38.144
// @connect 10.6.38.146
// @connect 10.6.38.138
// @connect 10.6.38.134
// @connect 10.6.38.139
// @connect 10.6.38.130
// @connect 10.6.38.161
// @connect 10.6.38.85
// @connect 10.6.68.138
// @connect 10.6.39.72
// @connect 10.6.38.202
// @connect 10.6.38.214
// @connect 10.6.38.198
// @connect 10.6.39.67
// @connect 10.6.39.78
// @connect 10.6.38.219
// @connect 10.6.51.25
// @connect 10.6.51.29
// @connect 10.6.38.203
// @connect 10.6.38.201
// @connect 10.6.38.218
// @connect 10.6.51.31
// @connect 10.6.39.69
// @connect 10.6.39.83
// @connect 10.6.51.20
// @connect 10.6.39.80
// @connect 10.6.51.28
// @connect 10.6.51.18
// @connect 10.6.39.85
// @connect 10.6.51.27
// @connect 10.6.38.199
// @connect 10.6.39.81
// @connect 10.6.38.211
// @connect 10.6.38.224
// @connect 10.6.38.222
// @connect 10.6.38.209
// @connect 10.6.38.207
// @connect 10.6.38.213
// @connect 10.6.51.21
// @connect 10.6.39.71
// @connect 10.6.38.197
// @connect 10.6.39.76
// @connect 10.6.38.206
// @connect 10.6.51.22
// @connect 10.6.51.33
// @connect 10.6.39.84
// @connect 10.6.38.210
// @connect 10.6.39.38
// @connect 10.6.39.77
// @connect 10.6.51.24
// @connect 10.6.38.208
// @connect 10.6.51.26
// @connect 10.6.39.79
// @connect 10.6.38.217
// @connect 10.6.39.68
// @connect 10.6.51.32
// @connect 10.6.39.74
// @connect 10.6.38.200
// @connect 10.6.38.232
// @connect 10.6.39.82
// @connect 10.6.39.75
// @connect 10.6.51.19
// @connect 10.6.38.204
// @connect 10.6.39.73
// @connect 10.6.51.23
// @connect 10.6.39.66
// @connect 10.6.39.86
// @connect 10.6.38.221
// @connect 10.6.51.30
// @connect 10.6.38.196
// @connect 10.6.38.205
// @connect 10.6.38.215
// @connect 10.6.38.212
// @connect 10.6.39.70
// @connect 10.6.39.8
// @connect 10.6.39.16
// @connect 10.6.39.4
// @connect 10.6.39.6
// @connect 10.6.39.3
// @connect 10.6.39.10
// @connect 10.6.39.2
// @connect 10.6.39.9
// @connect 10.6.39.17
// @connect 10.6.39.11
// @connect 10.6.39.32
// @connect 10.6.39.14
// @connect 10.6.39.35
// @connect 10.6.39.36
// @connect 10.6.39.27
// @connect 10.6.39.13
// @connect 10.6.39.12
// @connect 10.6.39.22
// @connect 10.6.39.21
// @connect 10.6.39.34
// @connect 10.6.39.19
// @connect 10.6.39.7
// @connect 10.6.39.15
// @connect 10.6.39.31
// @connect 10.6.39.23
// @connect 10.6.39.20
// @connect 10.6.39.24
// @connect 10.6.39.25
// @connect 10.6.39.18
// @connect 10.6.39.28
// @connect 10.6.39.37
// @connect 10.6.39.30
// @connect 10.6.39.29
// @connect 10.6.39.26
// @connect 10.6.39.5
// @connect 10.6.39.33
// @connect 10.6.39.39
// @connect 10.6.39.40
// @connect 10.6.38.233
// @connect 10.6.39.87
// @connect 10.6.39.41
// @connect 10.6.69.168
// @connect 10.6.74.7
// @connect 10.6.39.92
// @connect 10.6.39.103
// @connect 10.6.39.101
// @connect 10.6.39.96
// @connect 10.6.39.88
// @connect 10.6.39.91
// @connect 10.6.39.93
// @connect 10.6.39.99
// @connect 10.6.39.102
// @connect 10.6.39.89
// @connect 10.6.39.95
// @connect 10.6.39.98
// @connect 10.6.39.105
// @connect 10.6.39.90
// @connect 10.6.39.97
// @connect 10.6.39.104
// @connect 10.6.39.94
// @connect 10.6.39.100
// @connect 10.6.48.7
// @connect 10.6.48.35
// @connect 10.6.48.31
// @connect 10.6.48.21
// @connect 10.6.48.2
// @connect 10.6.48.39
// @connect 10.6.48.34
// @connect 10.6.48.19
// @connect 10.6.48.36
// @connect 10.6.48.38
// @connect 10.6.48.4
// @connect 10.6.36.9
// @connect 10.6.48.10
// @connect 10.6.48.3
// @connect 10.6.48.16
// @connect 10.6.48.23
// @connect 10.6.48.13
// @connect 10.6.48.30
// @connect 10.6.48.41
// @connect 10.6.48.26
// @connect 10.6.48.28
// @connect 10.6.48.15
// @connect 10.6.48.9
// @connect 10.6.48.8
// @connect 10.6.48.18
// @connect 10.6.36.8
// @connect 10.6.48.6
// @connect 10.6.48.20
// @connect 10.6.48.17
// @connect 10.6.48.24
// @connect 10.6.48.37
// @connect 10.6.48.33
// @connect 10.6.48.5
// @connect 10.6.48.40
// @connect 10.6.48.32
// @connect 10.6.48.29
// @connect 10.6.48.14
// @connect 10.6.48.22
// @connect 10.6.48.25
// @connect 10.6.48.12
// @connect 10.6.48.78
// @connect 10.6.36.3
// @connect 10.6.48.72
// @connect 10.6.48.90
// @connect 10.6.48.151
// @connect 10.6.48.139
// @connect 10.6.48.69
// @connect 10.6.48.66
// @connect 10.6.48.82
// @connect 10.6.36.5
// @connect 10.6.48.104
// @connect 10.6.48.85
// @connect 10.6.48.67
// @connect 10.6.48.88
// @connect 10.6.48.84
// @connect 10.6.48.71
// @connect 10.6.48.91
// @connect 10.6.48.99
// @connect 10.6.48.94
// @connect 10.6.48.68
// @connect 10.6.48.76
// @connect 10.6.48.73
// @connect 10.6.48.86
// @connect 10.6.48.140
// @connect 10.6.48.11
// @connect 10.6.48.81
// @connect 10.6.48.137
// @connect 10.6.48.148
// @connect 10.6.48.102
// @connect 10.6.48.144
// @connect 10.6.48.77
// @connect 10.6.48.74
// @connect 10.6.38.195
// @connect 10.6.48.147
// @connect 10.6.48.162
// @connect 10.6.48.87
// @connect 10.6.48.96
// @connect 10.6.48.131
// @connect 10.6.48.143
// @connect 10.6.48.100
// @connect 10.6.48.92
// @connect 10.6.48.103
// @connect 10.6.48.159
// @connect 10.6.48.141
// @connect 10.6.48.98
// @connect 10.6.48.157
// @connect 10.6.48.93
// @connect 10.6.48.135
// @connect 10.6.48.136
// @connect 10.6.48.130
// @connect 10.6.48.70
// @connect 10.6.48.168
// @connect 10.6.48.155
// @connect 10.6.48.153
// @connect 10.6.48.149
// @connect 10.6.48.105
// @connect 10.6.48.166
// @connect 10.6.48.101
// @connect 10.6.48.164
// @connect 10.6.48.152
// @connect 10.6.48.75
// @connect 10.6.48.145
// @connect 10.6.48.95
// @connect 10.6.48.132
// @connect 10.6.48.150
// @connect 10.6.48.142
// @connect 10.6.48.146
// @connect 10.6.48.83
// @connect 10.6.48.158
// @connect 10.6.48.97
// @connect 10.6.48.134
// @connect 10.6.48.156
// @connect 10.6.48.89
// @connect 10.6.48.133
// @connect 10.6.48.138
// @connect 10.6.48.163
// @connect 10.6.48.154
// @connect 10.6.48.161
// @connect 10.6.48.160
// @connect 10.6.48.169
// @connect 10.6.49.8
// @connect 10.6.48.221
// @connect 10.6.49.22
// @connect 10.6.49.17
// @connect 10.6.49.5
// @connect 10.6.49.3
// @connect 10.6.48.207
// @connect 10.6.48.212
// @connect 10.6.48.27
// @connect 10.6.49.16
// @connect 10.6.49.20
// @connect 10.6.49.14
// @connect 10.6.49.11
// @connect 10.6.49.4
// @connect 10.6.49.19
// @connect 10.6.48.214
// @connect 10.6.49.7
// @connect 10.6.49.29
// @connect 10.6.49.9
// @connect 10.6.48.194
// @connect 10.6.49.25
// @connect 10.6.48.216
// @connect 10.6.49.18
// @connect 10.6.49.28
// @connect 10.6.48.215
// @connect 10.6.49.15
// @connect 10.6.49.10
// @connect 10.6.49.21
// @connect 10.6.48.195
// @connect 10.6.48.224
// @connect 10.6.48.202
// @connect 10.6.48.217
// @connect 10.6.49.31
// @connect 10.6.48.205
// @connect 10.6.48.204
// @connect 10.6.48.219
// @connect 10.6.48.203
// @connect 10.6.48.208
// @connect 10.6.48.210
// @connect 10.6.48.213
// @connect 10.6.49.6
// @connect 10.6.49.12
// @connect 10.6.48.200
// @connect 10.6.49.2
// @connect 10.6.49.30
// @connect 10.6.49.24
// @connect 10.6.49.27
// @connect 10.6.49.23
// @connect 10.6.48.211
// @connect 10.6.49.26
// @connect 10.6.48.209
// @connect 10.6.48.201
// @connect 10.6.48.218
// @connect 10.6.48.197
// @connect 10.6.48.206
// @connect 10.6.48.220
// @connect 10.6.48.196
// @connect 10.6.48.199
// @connect 10.6.48.198
// @connect 10.6.49.13
// @connect 10.6.48.222
// @connect 10.6.48.231
// @connect 10.6.48.232
// @connect 10.6.48.233
// @connect 10.6.37.233
// @connect 10.6.48.226
// @connect 10.6.48.225
// @connect 10.6.48.229
// @connect 10.6.48.227
// @connect 10.6.49.34
// @connect 10.6.49.37
// @connect 10.6.49.38
// @connect 10.6.49.36
// @connect 10.6.49.32
// @connect 10.6.49.39
// @connect 10.6.49.35
// @connect 10.6.49.33
// @connect 10.6.49.41
// @connect 10.6.48.80
// @connect 10.6.36.161
// @connect 10.6.49.67
// @connect 10.6.49.104
// @connect 10.6.49.98
// @connect 10.6.49.77
// @connect 10.6.49.82
// @connect 10.6.49.75
// @connect 10.6.49.93
// @connect 10.6.49.84
// @connect 10.6.49.76
// @connect 10.6.49.70
// @connect 10.6.49.88
// @connect 10.6.49.78
// @connect 10.6.49.79
// @connect 10.6.49.96
// @connect 10.6.49.74
// @connect 10.6.49.66
// @connect 10.6.49.100
// @connect 10.6.49.97
// @connect 10.6.49.72
// @connect 10.6.49.69
// @connect 10.6.49.90
// @connect 10.6.49.71
// @connect 10.6.49.73
// @connect 10.6.49.102
// @connect 10.6.49.80
// @connect 10.6.49.95
// @connect 10.6.49.86
// @connect 10.6.49.81
// @connect 10.6.49.91
// @connect 10.6.49.83
// @connect 10.6.49.68
// @connect 10.6.49.85
// @connect 10.6.49.87
// @connect 10.6.49.92
// @connect 10.6.49.99
// @connect 10.6.49.101
// @connect 10.6.49.89
// @connect 10.6.49.103
// @connect 10.6.49.105
// @connect 10.6.49.151
// @connect 10.6.49.147
// @connect 10.6.49.132
// @connect 10.6.49.144
// @connect 10.6.49.134
// @connect 10.6.49.152
// @connect 10.6.49.148
// @connect 10.6.49.136
// @connect 10.6.49.135
// @connect 10.6.49.157
// @connect 10.6.49.140
// @connect 10.6.49.145
// @connect 10.6.49.146
// @connect 10.6.49.143
// @connect 10.6.49.141
// @connect 10.6.49.139
// @connect 10.6.49.137
// @connect 10.6.49.131
// @connect 10.6.49.149
// @connect 10.6.49.130
// @connect 10.6.49.159
// @connect 10.6.49.138
// @connect 10.6.49.158
// @connect 10.6.49.156
// @connect 10.6.49.142
// @connect 10.6.49.150
// @connect 10.6.49.133
// @connect 10.6.49.155
// @connect 10.6.49.154
// @connect 10.6.49.153
// @connect 10.6.49.214
// @connect 10.6.49.168
// @connect 10.6.49.160
// @connect 10.6.49.197
// @connect 10.6.49.164
// @connect 10.6.49.196
// @connect 10.6.49.199
// @connect 10.6.49.195
// @connect 10.6.48.79
// @connect 10.6.49.216
// @connect 10.6.49.163
// @connect 10.6.49.203
// @connect 10.6.49.167
// @connect 10.6.49.211
// @connect 10.6.49.161
// @connect 10.6.49.210
// @connect 10.6.49.162
// @connect 10.6.49.201
// @connect 10.6.49.212
// @connect 10.6.49.215
// @connect 10.6.49.165
// @connect 10.6.49.217
// @connect 10.6.49.198
// @connect 10.6.49.194
// @connect 10.6.49.207
// @connect 10.6.49.204
// @connect 10.6.49.166
// @connect 10.6.49.206
// @connect 10.6.49.169
// @connect 10.6.49.205
// @connect 10.6.49.200
// @connect 10.6.49.202
// @connect 10.6.49.209
// @connect 10.6.49.213
// @connect 10.6.50.13
// @connect 10.6.50.5
// @connect 10.6.50.21
// @connect 10.6.50.40
// @connect 10.6.50.36
// @connect 10.6.50.38
// @connect 10.6.50.14
// @connect 10.6.50.4
// @connect 10.6.50.32
// @connect 10.6.50.28
// @connect 10.6.50.19
// @connect 10.6.50.33
// @connect 10.6.50.17
// @connect 10.6.50.11
// @connect 10.6.50.35
// @connect 10.6.50.22
// @connect 10.6.50.12
// @connect 10.6.50.37
// @connect 10.6.50.25
// @connect 10.6.49.231
// @connect 10.6.49.225
// @connect 10.6.50.20
// @connect 10.6.50.16
// @connect 10.6.49.222
// @connect 10.6.50.8
// @connect 10.6.50.39
// @connect 10.6.50.30
// @connect 10.6.50.31
// @connect 10.6.49.233
// @connect 10.6.49.219
// @connect 10.6.50.3
// @connect 10.6.50.23
// @connect 10.6.49.229
// @connect 10.6.49.208
// @connect 10.6.49.221
// @connect 10.6.49.224
// @connect 10.6.36.152
// @connect 10.6.50.18
// @connect 10.6.50.29
// @connect 10.6.49.226
// @connect 10.6.49.230
// @connect 10.6.50.6
// @connect 10.6.50.7
// @connect 10.6.49.228
// @connect 10.6.50.15
// @connect 10.6.50.27
// @connect 10.6.38.220
// @connect 10.6.50.10
// @connect 10.6.49.220
// @connect 10.6.50.9
// @connect 10.6.50.26
// @connect 10.6.50.24
// @connect 10.6.49.223
// @connect 10.6.50.2
// @connect 10.6.50.41
// @connect 10.6.50.66
// @connect 10.6.50.86
// @connect 10.6.50.81
// @connect 10.6.50.80
// @connect 10.6.50.82
// @connect 10.6.50.68
// @connect 10.6.50.79
// @connect 10.6.50.85
// @connect 10.6.50.70
// @connect 10.6.50.76
// @connect 10.6.50.198
// @connect 10.6.50.78
// @connect 10.6.50.72
// @connect 10.6.50.84
// @connect 10.6.36.7
// @connect 10.6.50.101
// @connect 10.6.36.6
// @connect 10.6.50.73
// @connect 10.6.50.95
// @connect 10.6.50.74
// @connect 10.6.50.165
// @connect 10.6.51.37
// @connect 10.6.50.197
// @connect 10.6.50.203
// @connect 10.6.50.142
// @connect 10.6.50.77
// @connect 10.6.50.161
// @connect 10.6.50.229
// @connect 10.6.51.34
// @connect 10.6.50.69
// @connect 10.6.50.134
// @connect 10.6.50.94
// @connect 10.6.50.228
// @connect 10.6.50.131
// @connect 10.6.50.216
// @connect 10.6.50.159
// @connect 10.6.50.169
// @connect 10.6.50.195
// @connect 10.6.50.211
// @connect 10.6.50.104
// @connect 10.6.50.130
// @connect 10.6.50.87
// @connect 10.6.50.154
// @connect 10.6.50.88
// @connect 10.6.50.207
// @connect 10.6.51.68
// @connect 10.6.50.199
// @connect 10.6.51.69
// @connect 10.6.50.98
// @connect 10.6.51.41
// @connect 10.6.50.201
// @connect 10.6.51.38
// @connect 10.6.50.158
// @connect 10.6.50.135
// @connect 10.6.50.141
// @connect 10.6.50.215
// @connect 10.6.50.163
// @connect 10.6.50.136
// @connect 10.6.50.206
// @connect 10.6.50.149
// @connect 10.6.50.140
// @connect 10.6.50.144
// @connect 10.6.50.71
// @connect 10.6.50.164
// @connect 10.6.50.223
// @connect 10.6.51.39
// @connect 10.6.50.138
// @connect 10.6.50.152
// @connect 10.6.50.196
// @connect 10.6.50.210
// @connect 10.6.50.89
// @connect 10.6.50.157
// @connect 10.6.50.222
// @connect 10.6.50.212
// @connect 10.6.50.150
// @connect 10.6.50.166
// @connect 10.6.50.143
// @connect 10.6.50.202
// @connect 10.6.50.208
// @connect 10.6.50.231
// @connect 10.6.50.91
// @connect 10.6.50.92
// @connect 10.6.51.66
// @connect 10.6.50.147
// @connect 10.6.50.162
// @connect 10.6.50.153
// @connect 10.6.50.160
// @connect 10.6.50.132
// @connect 10.6.50.148
// @connect 10.6.50.209
// @connect 10.6.50.151
// @connect 10.6.50.83
// @connect 10.6.51.35
// @connect 10.6.50.146
// @connect 10.6.50.145
// @connect 10.6.50.205
// @connect 10.6.50.137
// @connect 10.6.50.156
// @connect 10.6.51.36
// @connect 10.6.50.218
// @connect 10.6.51.40
// @connect 10.6.50.214
// @connect 10.6.51.67
// @connect 10.6.50.97
// @connect 10.6.50.204
// @connect 10.6.50.220
// @connect 10.6.50.100
// @connect 10.6.50.103
// @connect 10.6.50.168
// @connect 10.6.50.139
// @connect 10.6.50.67
// @connect 10.6.50.200
// @connect 10.6.50.232
// @connect 10.6.50.155
// @connect 10.6.50.226
// @connect 10.6.50.217
// @connect 10.6.50.213
// @connect 10.6.50.219
// @connect 10.6.50.194
// @connect 10.6.50.133
// @connect 10.6.74.2
// @connect 10.6.21.74
// @connect 10.6.14.76
// @connect 10.6.4.39
// @connect 10.6.23.41
// @connect 10.6.41.156
// @connect 10.6.22.169
// @connect 10.6.41.207
// @connect 10.6.57.77
// @connect 10.6.40.170
// @connect 10.6.41.199
// @connect 10.6.41.200
// @connect 10.6.41.202
// @connect 10.6.41.205
// @connect 10.6.41.206
// @connect 10.6.41.210
// @connect 10.6.41.167
// @connect 10.6.41.133
// @connect 10.6.41.137
// @connect 10.6.41.136
// @connect 10.6.41.138
// @connect 10.6.41.139
// @connect 10.6.41.140
// @connect 10.6.41.143
// @connect 10.6.41.166
// @connect 10.6.41.144
// @connect 10.6.41.168
// @connect 10.6.38.194
// @connect 10.6.4.9
// @connect 10.6.8.160
// @connect 10.6.22.234
// @connect 10.6.21.234
// @connect 10.6.4.28
// @connect 10.6.33.198
// @connect 10.6.33.106
// @connect 10.6.41.145
// @connect 10.6.41.151
// @connect 10.6.41.155
// @connect 10.6.59.88
// @connect 10.6.36.2
// @connect 10.6.16.34
// @connect 10.6.19.39
// @connect 10.6.40.234
// @connect 10.6.63.16
// @connect 10.6.73.81
// @connect 10.6.69.192
// @connect 10.6.42.2
// @connect 10.6.42.33
// @connect 10.6.40.92
// @connect 10.6.42.18
// @connect 10.6.42.30
// @connect 10.6.41.157
// @connect 10.6.42.6
// @connect 10.6.34.93
// @connect 10.6.41.227
// @connect 10.6.41.220
// @connect 10.6.41.225
// @connect 10.6.41.226
// @connect 10.6.41.221
// @connect 10.6.72.163
// @connect 10.6.68.159
// @connect 10.6.32.38
// @connect 10.6.41.161
// @connect 10.6.52.67
// @connect 10.6.68.167
// @connect 10.6.29.202
// @connect 10.6.66.49
// @connect 10.6.69.49
// @connect 10.6.69.27
// @connect 10.6.68.7
// @connect 10.6.72.154
// @connect 10.6.5.160
// @connect 10.6.69.62
// @connect 10.6.69.86
// @connect 10.6.5.26
// @connect 10.6.41.215
// @connect 10.6.72.105
// @connect 10.6.18.166
// @connect 10.6.69.130
// @connect 10.6.41.132
// @connect 10.6.41.218
// @connect 10.6.69.238
// @connect 10.6.70.7
// @connect 10.6.70.8
// @connect 10.6.70.15
// @connect 10.6.70.25
// @connect 10.6.70.51
// @connect 10.6.70.53
// @connect 10.6.70.56
// @connect 10.6.70.57
// @connect 10.6.70.58
// @connect 10.6.70.59
// @connect 10.6.70.60
// @connect 10.6.70.61
// @connect 10.6.70.62
// @connect 10.6.70.63
// @connect 10.6.70.64
// @connect 10.6.70.65
// @connect 10.6.70.66
// @connect 10.6.70.67
// @connect 10.6.70.68
// @connect 10.6.70.69
// @connect 10.6.70.70
// @connect 10.6.70.71
// @connect 10.6.70.72
// @connect 10.6.70.74
// @connect 10.6.70.75
// @connect 10.6.70.76
// @connect 10.6.70.77
// @connect 10.6.70.78
// @connect 10.6.70.79
// @connect 10.6.70.80
// @connect 10.6.70.81
// @connect 10.6.70.82
// @connect 10.6.70.83
// @connect 10.6.70.84
// @connect 10.6.70.85
// @connect 10.6.70.86
// @connect 10.6.70.87
// @connect 10.6.70.88
// @connect 10.6.70.89
// @connect 10.6.70.91
// @connect 10.6.70.90
// @connect 10.6.70.92
// @connect 10.6.70.93
// @connect 10.6.70.94
// @connect 10.6.70.95
// @connect 10.6.70.96
// @connect 10.6.70.97
// @connect 10.6.70.98
// @connect 10.6.70.99
// @connect 10.6.70.100
// @connect 10.6.70.101
// @connect 10.6.70.102
// @connect 10.6.70.103
// @connect 10.6.70.104
// @connect 10.6.43.71
// @connect 10.6.70.105
// @connect 10.6.70.106
// @connect 10.6.70.108
// @connect 10.6.70.107
// @connect 10.6.70.109
// @connect 10.6.70.110
// @connect 10.6.70.111
// @connect 10.6.70.112
// @connect 10.6.70.113
// @connect 10.6.70.114
// @connect 10.6.70.115
// @connect 10.6.70.116
// @connect 10.6.70.117
// @connect 10.6.70.118
// @connect 10.6.70.119
// @connect 10.6.70.120
// @connect 10.6.70.122
// @connect 10.6.70.121
// @connect 10.6.70.124
// @connect 10.6.70.123
// @connect 10.6.70.126
// @connect 10.6.70.125
// @connect 10.6.70.127
// @connect 10.6.70.128
// @connect 10.6.70.129
// @connect 10.6.70.130
// @connect 10.6.20.16
// @connect 10.6.68.41
// @connect 10.6.68.72
// @connect 10.6.68.142
// @connect 10.6.68.145
// @connect 10.6.68.146
// @connect 10.6.68.147
// @connect 10.6.68.160
// @connect 10.6.68.164
// @connect 10.6.68.163
// @connect 10.6.73.101
// @connect 10.6.68.4
// @connect 10.6.68.8
// @connect 10.6.23.30
// @connect 10.6.35.29
// @connect 10.6.68.3
// @connect 10.6.68.6
// @connect 10.6.68.9
// @connect 10.6.68.10
// @connect 10.6.68.11
// @connect 10.6.68.18
// @connect 10.6.68.27
// @connect 10.6.68.31
// @connect 10.6.68.114
// @connect 10.6.68.121
// @connect 10.6.68.126
// @connect 10.6.68.135
// @connect 10.6.68.143
// @connect 10.6.68.148
// @connect 10.6.68.153

// @require      https://userscripts-mirror.org/scripts/source/107941.user.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js
// @require      https://foundryoptifleet.com/scripts/axios.min.js
// @require      https://raw.githubusercontent.com/Sufficingpit29/FoundryScript/main/HackyWorkAround.js
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdn.datatables.net/1.13.1/js/jquery.dataTables.min.js
// @require      https://cdn.datatables.net/colreorder/1.6.2/js/dataTables.colReorder.min.js
// @require      https://cdn.datatables.net/responsive/2.4.0/js/dataTables.responsive.min.js
// @require      https://cdn.jsdelivr.net/npm/datatables.net-colresize/js/dataTables.colResize.min.js
// @resource     https://cdn.datatables.net/1.13.1/css/jquery.dataTables.min.css
// @resource     https://cdn.datatables.net/colreorder/1.6.2/css/colReorder.dataTables.min.css
// @resource     https://cdn.datatables.net/responsive/2.4.0/css/responsive.dataTables.min.css
// @resource     https://cdn.jsdelivr.net/npm/datatables.net-colresize@1.1.0/css/dataTables.colResize.min.css
// @run-at       document-start
// ==/UserScript==


const currentUrl = window.location.href;
if(currentUrl.includes("OptiWatch")) {
    return;
}

const allowedSites = [
    "foundryoptifleet.com",
    "planner",
    "sharepoint",
    "planner.cloud.office",
    "bitmain",
];

console.log("Current URL:", currentUrl);

// See if the URL likly contains a IP address
const ipRegex = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
const ipURLMatch = currentUrl.match(ipRegex);

// Check if the current URL is allowed
const allowedSiteMatch = allowedSites.some(site => currentUrl.includes(site));

if(!ipURLMatch && !allowedSiteMatch) {
    console.log("Script not for this site, exiting...");
    return false;
}

const username = 'root';
const password = 'root';
function fetchGUIData(url) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            user: username,
            password: password,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    resolve(response.responseText);
                } else if (response.status === 401) {
                    reject('Authentication failed. Please check your username and password.');
                } else {
                    reject(`HTTP error! status: ${response.status}`);
                }
            },
            onerror: function(error) {
                reject('There was a problem with the fetch operation:', error);
            }
        });
    });
}

// Where we define the different error strctures to locate
const errorsToSearch = {
    /*
    'Test Error': {
        icon: "https://icons8.com/icon/35881/test-passed",
        start: "Booting Linux on physical",
    },
    */
    'Bad Hashboard Chain': {
        icon: "https://img.icons8.com/?size=100&id=12607&format=png&color=FFFFFF",
        start: ["get pll config err", /Chain\[0\]: find .* asic, times/], // 0
        end: ["stop_mining: soc init failed"],
        conditions: (text) => {
            return text.includes('only find');
        }
    },
    'ASIC Number Error': {
        icon: "https://img.icons8.com/?size=100&id=oirUg9VSEnSv&format=png&color=FFFFFF",
        start: ["Chain[0]: find "],
        end: ["stop_mining: asic number is not right"],
        conditions: (text) => {
            return text.includes('asic number is not right');
        }
    },
    'Fan Speed Error': {
        icon: "https://img.icons8.com/?size=100&id=t7Gbjm3OaxbM&format=png&color=FFFFFF",
        start: ["Error, fan lost,", "Exit due to FANS NOT DETECTED | FAN FAILED", /\[WARN\] FAN \d+ Fail/],
        end: ["stop_mining_and_restart: fan lost", "stop_mining: fan lost", "ERROR_FAN_LOST: fan lost", " has failed to run at expected RPM"]
    },
    'SOC INIT Fail': {
        icon: "https://img.icons8.com/?size=100&id=gUSpFL9LqIG9&format=png&color=FFFFFF",
        start: "ERROR_SOC_INIT",
        end: ["ERROR_SOC_INIT", "stop_mining: soc init failed!"],
        onlySeparate: true
    },
    'Buffer Error': {
        icon: "https://img.icons8.com/?size=100&id=Hd082AfY0mbD&format=png&color=FFFFFF",
        start: "nonce_read_out buffer is full!",
    },
    'EEPROM Error': {
        icon: "https://img.icons8.com/?size=100&id=9040&format=png&color=FFFFFF",
        start: "eeprom error crc 3rd region",
        end: "eeprom error crc 3rd region",
        onlySeparate: true
    },
    'Hashboard Init Fail': {
        icon: "https://img.icons8.com/?size=100&id=35849&format=png&color=FFFFFF",
        start: "Exit due to HASHBOARD INITIALIZATION FAILED",
        onlySeparate: true
    },
    'Target Hashrate Fail': {
        icon: "https://img.icons8.com/?size=100&id=20767&format=png&color=FFFFFF",
        start: "Exit due to Unable to Generate Given Target Hashrate",
        onlySeparate: true
    },
    'Voltage Abnormity': {
        icon: "https://img.icons8.com/?size=100&id=61096&format=png&color=FFFFFF",
        start: ["chain avg vol drop from", "ERROR_POWER_LOST"],
        end: ["power voltage err", "ERROR_POWER_LOST: power voltage rise or drop", "stop_mining_and_restart: power voltage read failed", "power voltage abnormity", "stop_mining: soc init failed", "stop_mining: get power type version failed!", "stop_mining: power status err, pls check!", "stop_mining: power voltage rise or drop, pls check!", "stop_mining: pic check voltage drop"],
    },
    'Temperature Sensor Error': {
        icon: "https://img.icons8.com/?size=100&id=IN6gab7HZOis&format=png&color=FFFFFF",
        start: "Exit due to TEMPERATURE SENSORS FAILED",
    },
    'Temperature Too Low': {
        icon: "https://img.icons8.com/?size=100&id=0Bm1Quaegs8d&format=png&color=FFFFFF",
        start: "ERROR_TEMP_TOO_LOW",
        end: "stop_mining"
    },
    'Temperature Overheat': {
        icon: "https://img.icons8.com/?size=100&id=er279jFX2Yuq&format=png&color=FFFFFF",
        start: ["asic temp too high", "ERROR_TEMP_TOO_HIGH", "Exit due to SHUTDOWN TEMPERATURE LIMIT REACHED"],
        end: ["stop_mining: asic temp too high", "stop_mining: over max temp"],
    },
    'Network Lost': {
        icon: "https://img.icons8.com/?size=100&id=Kjoxcp7iiC5M&format=png&color=FFFFFF",
        start: ["WARN_NET_LOST", "ERROR_NET_LOST"],
        end: ["ERROR_UNKOWN_STATUS: power off by NET_LOST", "stop_mining_and_restart: network connection", "stop_mining: power off by NET_LOST", "network connection resume", "network connection lost for"],
    },
    'Bad Chain ID': {
        icon: "https://img.icons8.com/?size=100&id=W7rVpJuanYI8&format=png&color=FFFFFF",
        start: "bad chain id",
        end: "stop_mining: basic init failed!",
        unimportant: true
    },
    'Firmware Error': {
        icon: "https://img.icons8.com/?size=100&id=hbCljOlfk4WP&format=png&color=FFFFFF",
        start: "Firmware registration failed",
        unimportant: true
    },
    'ASIC Error': {
        icon: "https://img.icons8.com/?size=100&id=gUSpFL9LqIG9&format=png&color=FFFFFF",
        start: "test_loop_securely_find_asic_num",
        unimportant: true
    },
    'Defendkey Error': {
        start: "defendkey: probe of defendkey failed with error",
        unimportant: true
    },
    'SN File Error': {
        start: "Open miner sn file /config/sn error",
        unimportant: true
    },
    'Allocate Memory Error': {
        start: "failed to allocate memory for node linux",
        unimportant: true
    },
    'Modalias Failure': {
        start: "modalias failure",
        unimportant: true
    },
    'CLKMSR Failure': {
        start: "clkmsr ffd18004.meson_clk_msr: failed to get msr",
        unimportant: true
    },
    'Unpack Failure': {
        start: "Initramfs unpacking failed",
        unimportant: true
    },
    'I2C Device': {
        start: "Failed to create I2C device",
        unimportant: true
    },
    'No Ports': {
        start: "hub doesn't have any ports",
        unimportant: true
    },
    'Thermal Binding': {
        start: "binding zone soc_thermal with cdev thermal",
        unimportant: true
    },
    'PTP Init Failure': {
        start: "fail to init PTP",
        unimportant: true
    },
    'Ram Error': {
        icon: "https://img.icons8.com/?size=100&id=2lS2aIm5uhCG&format=png&color=FFFFFF",
        start: "persistent_ram: uncorrectable error in header",
        unimportant: true
    }
}

function runErrorScanLogic(logText) {
    // Search through the log and locate errors
    var errorsFound = []; // Array to store the errors found
    for (const error in errorsToSearch) {
        const errorData = errorsToSearch[error];
        var lastEndIndex = 0;
        var maxIterations = 100;
        while(maxIterations > -1) {
            maxIterations--;
            if (maxIterations <= 0) {
                console.error('Max iterations reached');
                break;
            }
            var startIndex = -1;
            if (!Array.isArray(errorData.start)) {
                errorData.start = [errorData.start];
            }

            for (const start of errorData.start) {
                let curIndex;
                if (typeof start === 'string') {
                    curIndex = logText.indexOf(start, lastEndIndex);
                } else if (start instanceof RegExp) {
                    const match = logText.slice(lastEndIndex).match(start);
                    if (match) {
                        curIndex = lastEndIndex + match.index;
                    } else {
                        curIndex = -1; // No match found
                    }
                } else {
                    throw new Error('Unsupported type for start');
                }

                if (curIndex !== -1 && (startIndex === -1 || curIndex < startIndex)) {
                    startIndex = curIndex;
                }
            }

            if (startIndex !== -1) {
                // If errorData.end isn't found, just set it to be start
                if (!errorData.end || errorData.end === "" || errorData.end === undefined) {
                    errorData.end = errorData.start;
                }

                var endIndex = -1;
                if (!Array.isArray(errorData.end)) {
                    errorData.end = [errorData.end];
                }

                const separatorTexts = ["start the http log", "****power off hashboard****"];
                for (const end of errorData.end) {
                    let curIndex;
                    if (typeof end === 'string') {
                        curIndex = logText.indexOf(end, startIndex);
                    } else if (end instanceof RegExp) {
                        const match = logText.slice(startIndex).match(end);
                        if (match) {
                            curIndex = startIndex + match.index;
                        } else {
                            curIndex = -1; // No match found
                        }
                    } else {
                        throw new Error('Unsupported type for end');
                    }
                    if (curIndex !== -1 && (endIndex === -1 || curIndex > endIndex)) {
                        // Make sure another start doesn't appear before the end & make sure a separator doesn't appear between the start and end
                        const lineAfterStart = logText.indexOf('\n', startIndex);
                        if (!errorData.start.some(start => logText.indexOf(start, lineAfterStart) < curIndex && logText.indexOf(start, lineAfterStart) !== -1) && !separatorTexts.some(separator => logText.indexOf(separator, startIndex) < curIndex && logText.indexOf(separator, startIndex) !== -1)) {
                            endIndex = curIndex;
                        }
                    }
                }
                // Set the start index to be back at the start of the line
                const lastLineBreak = logText.lastIndexOf('\n', startIndex);
                if (lastLineBreak !== -1) {
                    startIndex = lastLineBreak + 1;
                }

                // Set the end index to be at the end of the line
                const nextLineBreak = logText.indexOf('\n', endIndex);
                if (nextLineBreak !== -1) {
                    endIndex = nextLineBreak + 1;
                }

                // If the start index is after the end index, just do the one start line
                if(startIndex > endIndex) {
                    endIndex = logText.indexOf('\n', startIndex) + 1;
                }

                var setEndIndexAfter;
                if (endIndex !== -1) {
                    const errorText = logText.substring(startIndex, endIndex);

                    // if onlySeparate is true, only add the error if it doesn't appear in another start/end as another error
                    var errorTextAlreadyFound = false;
                    if(errorData.onlySeparate) {
                        if(errorsFound.some(err => err.text.includes(errorText))) {
                            errorTextAlreadyFound = true;
                        }
                    }

                    // Check if the error text meets the conditions
                    if (typeof errorData.conditions === 'function' ? errorData.conditions(errorText) : true && !errorTextAlreadyFound) {
                        errorsFound.push({
                            name: error,
                            icon: errorData.icon,
                            text: errorText.trimEnd(),
                            start: startIndex,
                            end: endIndex,
                            unimportant: errorData.unimportant || false
                        });
                        setEndIndexAfter = endIndex;
                    } else {
                        console.log('Error text did not meet conditions');
                        setEndIndexAfter = logText.indexOf('\n', startIndex) + 1;
                    }
                } else {
                    setEndIndexAfter = logText.indexOf('\n', startIndex) + 1;
                }
            }

            if (startIndex === -1 || endIndex === -1 || lastEndIndex === endIndex) {
                console.log('No more errors found');
                break;
            }

            lastEndIndex = setEndIndexAfter;
        }
    }

    // Find all the times 'error' or 'fail' is mentioned in the log if it isn't already found in the defined errors, mark is as an Unknown Error
    const errorRegex = /error/gi;
    const failRegex = /fail/gi;
    const errorMatches = [...logText.toLowerCase().matchAll(errorRegex), ...logText.toLowerCase().matchAll(failRegex)];
    for (const match of errorMatches) {
        // Check if the error is already found
        const matchIndex = match.index;
        if (!errorsFound.some(error => matchIndex >= error.start && matchIndex <= error.end)) {
            // Find the start and end of the line
            const start = logText.lastIndexOf('\n', matchIndex) + 1;
            const end = logText.indexOf('\n', matchIndex) + 1;
            const errorText = logText.substring(start, end);

            // Add the error to the list of errors
            errorsFound.push({
                name: 'Unknown Error',
                text: errorText.trimEnd(),
                start: start,
                end: end,
                unimportant: true
            });
        }
    }
    
    return errorsFound;
}

window.addEventListener('load', function () {
    var urlLookupExcel = {};
    const defaultExcelLink = "https://foundrydigitalllc.sharepoint.com/sites/SiteOps/Shared%20Documents/Forms/AllItems.aspx?FolderCTID=0x0120008E92A0115CE81A4697B69C652EF13609&id=%2Fsites%2FSiteOps%2FShared%20Documents%2F01%20Site%20Operations%2F01%20Documents%2F01%20Sites%2F05%20Minden%20NE&viewid=dae422b9%2D818b%2D4018%2Dabea%2D051873d09aa3";

    urlLookupExcel["Bitmain"] = GM_SuperValue.get("bitmainLink", defaultExcelLink);
    urlLookupExcel["Fortitude"] = GM_SuperValue.get("fortitudeLink", defaultExcelLink);;
    urlLookupExcel["RAMM"] = GM_SuperValue.get("rammLink", defaultExcelLink);

    const urlLookupPlanner = {
        "Bitmain": "https://planner.cloud.microsoft/webui/plan/wkeUw2vf1kqEkw6-XXaSR2UABn4T/view/board?tid=6681433f-a30d-43cd-8881-8e964fa723ad",
        "Fortitude": "https://planner.cloud.microsoft/webui/plan/TbJIxx_byEKhuMp-C4tXLGUAD3Tb/view/board?tid=6681433f-a30d-43cd-8881-8e964fa723ad",
        "RAMM": "https://planner.cloud.microsoft/webui/plan/FHYUYbYUfkqd2-oSKLk7xGUAHvRz?tid=6681433f-a30d-43cd-8881-8e964fa723ad"
    };

    function getPlannerID(string) {
        const plannerID = string.match(/plan\/([^?]+)/)[1].split('/')[0];
        return plannerID;
    }

    const urlLookupPlannerGrid = {
        "Fortitude": "https://planner.cloud.microsoft/webui/plan/TbJIxx_byEKhuMp-C4tXLGUAD3Tb/view/grid?tid=6681433f-a30d-43cd-8881-8e964fa723ad",
        "RAMM": "https://planner.cloud.microsoft/webui/plan/FHYUYbYUfkqd2-oSKLk7xGUAHvRz/view/grid?tid=6681433f-a30d-43cd-8881-8e964fa723ad",
        "Bitmain": "https://planner.cloud.microsoft/webui/plan/wkeUw2vf1kqEkw6-XXaSR2UABn4T/view/grid?tid=6681433f-a30d-43cd-8881-8e964fa723ad",
    }

    //-----------------

    function getSelectedSiteId() {
        return JSON.parse(localStorage.getItem("selectedSite"));
    }

    function getSelectedSiteName() {
        return localStorage.getItem("selectedSiteName");
    }

    function getSelectedCompanyId() {
        return JSON.parse(localStorage.getItem("selectedCompany"));
    }

    function OptiFleetSpecificLogic() {
        var allMinersData = {};
        var allMinersLookup = {};
        let frozenMiners = [];
        const disableFrozenMiners = true;
        let gotFrozenData = false;
        let gotFrozenDataFor = {};
        let activeMiners = 0;
        let foundActiveMiners = false;

        let OptiFleetService2 = Object.getPrototypeOf(unsafeWindow.ms);
        var serviceInstance = Object.getPrototypeOf(unsafeWindow.ms);
        
        var viewServiceInstance = new MinerViewService();
        var siteId = getSelectedSiteId();
        var siteName = getSelectedSiteName();
        var companyId = getSelectedCompanyId();
        var lastSiteId = siteId;
        var lastCompanyId = companyId;
        var lastMinerDataUpdate = 0;
        var reloadCards = false;

        let lastUpTime = {}; //GM_SuperValue.get("lastUpTime_"+siteName, {});

        function retrieveIssueMiners(callback) {
            // In case we swap company/site (Not actually sure if it matters for site, but might as well)
            __awaiter(serviceInstance, void 0, void 0, function* () {
                siteId = getSelectedSiteId();
                siteName = getSelectedSiteName();
                serviceInstance.get(`/Issues?siteId=${siteId}&zoneId=-1`).then(res => {
                    res.miners.filter(miner => miner.ipAddress == null).forEach(miner => miner.ipAddress = "Lease Expired");
                    if (callback) {
                        callback(res.miners);
                    }
                });
            });
        }

        function editalertThreshold() {
            // Check to see if the popup already exists and if so, don't create another
            const existingPopup = document.querySelector('.alert-amount-popup');
            if (existingPopup) {
                return;
            }

            const alertThreshold = GM_SuperValue.get("alertThreshold", 10);
            const majoralertThreshold = GM_SuperValue.get("majoralertThreshold", 500);
            const onlyNonHashing = GM_SuperValue.get("onlyNonHashing", "true") === "true";
            const alertEnabled = GM_SuperValue.get("alertEnabled", "true") === "true";
            const majorAlertEnable = GM_SuperValue.get("majorAlertEnable", "false") === "true";

            const popup = document.createElement('div');
            popup.style.position = 'fixed';
            popup.style.top = '50%';
            popup.style.left = '50%';
            popup.style.transform = 'translate(-50%, -50%)';
            popup.style.backgroundColor = '#333'; // Changed to match notification background
            popup.style.color = '#fff'; // Set text color to white for better contrast
            popup.style.padding = '20px';
            popup.style.borderRadius = '5px';
            popup.style.zIndex = '1001';

            const alertLabel = document.createElement('label');
            alertLabel.innerText = 'Enter new alert amount:';
            alertLabel.style.display = 'block';
            alertLabel.style.marginBottom = '10px';

            const alertInput = document.createElement('input');
            alertInput.type = 'number';
            alertInput.value = alertThreshold;
            alertInput.style.marginBottom = '10px';
            alertInput.style.width = '100%';
            alertInput.style.height = '30px'; // Set the height a bit bigger
            alertInput.style.backgroundColor = '#222'; // Changed to match notification background
            alertInput.style.color = '#fff'; // Set text color to white for better contrast

            const majorAlertLabel = document.createElement('label');
            majorAlertLabel.innerText = 'Enter new major alert amount:';
            majorAlertLabel.style.display = 'block';
            majorAlertLabel.style.marginBottom = '10px';

            const majorAlertInput = document.createElement('input');
            majorAlertInput.type = 'number';
            majorAlertInput.value = majoralertThreshold;
            majorAlertInput.style.marginBottom = '10px';
            majorAlertInput.style.width = '100%';
            majorAlertInput.style.height = '30px'; // Set the height a bit bigger
            majorAlertInput.style.backgroundColor = '#222'; // Changed to match notification background
            majorAlertInput.style.color = '#fff'; // Set text color to white for better contrast

            const onlyNonHashingContainer = document.createElement('div');
            onlyNonHashingContainer.style.display = 'flex';
            onlyNonHashingContainer.style.alignItems = 'center';
            
            const onlyNonHashingInput = document.createElement('input');
            onlyNonHashingInput.type = 'checkbox';
            onlyNonHashingInput.checked = onlyNonHashing;
            onlyNonHashingInput.style.marginBottom = '10px';
            onlyNonHashingInput.style.width = '20px'; // Set the width smaller
            onlyNonHashingInput.style.height = '20px'; // Set the height smaller
            onlyNonHashingInput.style.marginRight = '10px'; // Add some space to the right

            const onlyNonHashingLabelText = document.createElement('span');
            onlyNonHashingLabelText.innerText = 'Set non hashing miners only.';
            onlyNonHashingLabelText.style.color = '#fff'; // Set text color to white for better contrast
            onlyNonHashingLabelText.style.marginBottom = '10px';

            onlyNonHashingContainer.appendChild(onlyNonHashingInput);
            onlyNonHashingContainer.appendChild(onlyNonHashingLabelText);

            const alertEnabledContainer = document.createElement('div');
            alertEnabledContainer.style.display = 'flex';
            alertEnabledContainer.style.alignItems = 'center';
            
            const alertEnabledInput = document.createElement('input');
            alertEnabledInput.type = 'checkbox';
            alertEnabledInput.checked = alertEnabled;
            alertEnabledInput.style.marginBottom = '10px';
            alertEnabledInput.style.width = '20px'; // Set the width smaller
            alertEnabledInput.style.height = '20px'; // Set the height smaller
            alertEnabledInput.style.marginRight = '10px'; // Add some space to the right

            const alertEnabledLabelText = document.createElement('span');
            alertEnabledLabelText.innerText = 'Enable/Disable notifications.';
            alertEnabledLabelText.style.color = '#fff'; // Set text color to white for better contrast
            alertEnabledLabelText.style.marginBottom = '10px';

            alertEnabledContainer.appendChild(alertEnabledInput);
            alertEnabledContainer.appendChild(alertEnabledLabelText);
            
            const majorAlertEnableContainer = document.createElement('div');
            majorAlertEnableContainer.style.display = 'flex';
            majorAlertEnableContainer.style.alignItems = 'center';

            const majorAlertEnableInput = document.createElement('input');
            majorAlertEnableInput.type = 'checkbox';
            majorAlertEnableInput.checked = majorAlertEnable;
            majorAlertEnableInput.style.marginBottom = '10px';
            majorAlertEnableInput.style.width = '20px'; // Set the width smaller
            majorAlertEnableInput.style.height = '20px'; // Set the height smaller
            majorAlertEnableInput.style.marginRight = '10px'; // Add some space to the right

            const majorAlertEnableLabelText = document.createElement('span');
            majorAlertEnableLabelText.innerText = 'Enable/Disable major notifications.';
            majorAlertEnableLabelText.style.color = '#fff'; // Set text color to white for better contrast
            majorAlertEnableLabelText.style.marginBottom = '10px';

            majorAlertEnableContainer.appendChild(majorAlertEnableInput);
            majorAlertEnableContainer.appendChild(majorAlertEnableLabelText);

            const saveButton = document.createElement('button');
            saveButton.innerText = 'Save';
            saveButton.style.marginRight = '10px';
            saveButton.style.backgroundColor = '#4CAF50'; // Green background
            saveButton.style.color = 'white'; // White text
            saveButton.style.border = 'none';
            saveButton.style.borderRadius = '5px';
            saveButton.style.padding = '10px 20px';
            saveButton.style.textAlign = 'center'; // Center the text
            saveButton.style.cursor = 'pointer';
            saveButton.style.transition = 'background-color 0.3s ease';

            saveButton.addEventListener('mouseover', () => {
                saveButton.style.backgroundColor = '#45a049'; // Darker green on hover
            });

            saveButton.addEventListener('mouseout', () => {
                saveButton.style.backgroundColor = '#4CAF50'; // Original green when not hovering
            });

            saveButton.addEventListener('click', () => {
                const newalertThreshold = parseInt(alertInput.value);
                const newMajoralertThreshold = parseInt(majorAlertInput.value);
                if (!isNaN(newalertThreshold) && !isNaN(newMajoralertThreshold)) {
                    GM_SuperValue.set("alertThreshold", newalertThreshold);
                    GM_SuperValue.set("majoralertThreshold", newMajoralertThreshold);
                }

                GM_SuperValue.set("onlyNonHashing", onlyNonHashingInput.checked.toString());
                GM_SuperValue.set("alertEnabled", alertEnabledInput.checked.toString());
                GM_SuperValue.set("majorAlertEnable", majorAlertEnableInput.checked.toString());
                
                popup.remove();

                minerIssueNotification();
            });


            const cancelButton = document.createElement('button');
            cancelButton.innerText = 'Cancel';
            cancelButton.style.backgroundColor = 'red'; // Red background
            cancelButton.style.color = 'white'; // White text
            cancelButton.style.border = 'none';
            cancelButton.style.borderRadius = '5px';
            cancelButton.style.padding = '10px 20px';
            cancelButton.style.textAlign = 'center'; // Center the text
            cancelButton.style.cursor = 'pointer';
            cancelButton.style.transition = 'background-color 0.3s ease';

            cancelButton.addEventListener('mouseover', () => {
                cancelButton.style.backgroundColor = '#dc3545'; // Darker red on hover
            });

            cancelButton.addEventListener('mouseout', () => {
                cancelButton.style.backgroundColor = 'red'; // Original red when not hovering
            });

            cancelButton.addEventListener('click', () => {
                popup.remove();
            });

            popup.appendChild(alertLabel);
            popup.appendChild(alertInput);
            popup.appendChild(majorAlertLabel);
            popup.appendChild(majorAlertInput);
            popup.appendChild(onlyNonHashingContainer);
            popup.appendChild(alertEnabledContainer);
            popup.appendChild(majorAlertEnableContainer);
            popup.appendChild(saveButton);
            popup.appendChild(cancelButton);

            document.body.appendChild(popup);
        }
        
        
        // Add a small 'edit notification amount' button to bottom right
        if(currentUrl.includes("https://foundryoptifleet.com/Content/Issues/Issues") && siteName.includes("Minden")) {
            const editAmountButton = document.createElement('button');
            editAmountButton.innerText = 'Edit Alert';
            editAmountButton.style.position = 'fixed';
            editAmountButton.style.bottom = '10px';
            editAmountButton.style.right = '8px';
            editAmountButton.style.backgroundColor = '#333';
            editAmountButton.style.color = '#fff';
            editAmountButton.style.padding = '8px';
            editAmountButton.style.borderRadius = '3px';
            editAmountButton.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.3)';
            editAmountButton.style.cursor = 'pointer';
            editAmountButton.style.fontSize = '10px';
            editAmountButton.style.transition = 'background-color 0.3s ease';
            editAmountButton.id = 'editAmountButton';

            editAmountButton.addEventListener('mouseover', () => {
                editAmountButton.style.backgroundColor = '#444'; // Darker background on hover
            });

            editAmountButton.addEventListener('mouseout', () => {
                editAmountButton.style.backgroundColor = '#333'; // Original background when not hovering
            });

            editAmountButton.addEventListener('click', () => {
                editalertThreshold();
            });

            document.body.appendChild(editAmountButton);
        }

        // Get issue miners every minute, and if the count is over 100 show a notification
        function minerIssueNotification() {
            retrieveIssueMiners((issueMiners) => {
                let minerCount = issueMiners.length;
                const alertThreshold = GM_SuperValue.get("alertThreshold", 10);
                const majoralertThreshold = GM_SuperValue.get("majoralertThreshold", 500);
                const onlyNonHashing = GM_SuperValue.get("onlyNonHashing", "true") === "true";
                const alertEnabled = GM_SuperValue.get("alertEnabled", "true") === "true";
                const majorAlertEnable = GM_SuperValue.get("majorAlertEnable", "false") === "true";

                if (!alertEnabled) { return; }

                // Remove the current notification if it exists
                const existingNotification = document.querySelector('.miner-issue-notification');
                if (existingNotification) {
                    const editAmountButton = document.getElementById('editAmountButton');
                    if (editAmountButton) {
                        editAmountButton.style.display = 'block';
                        editAmountButton.style.opacity = '1';
                    }
                    existingNotification.remove();
                }

                // Only get the actual non hashing miners
                issueMiners = issueMiners.filter(miner => miner.hashrate === 0 || miner.issueType === 'Non Hashing');

                const allMiners = minerCount;
                const nonHashingMinerCount = issueMiners.length;
                const lowHashingMinerCount = allMiners - nonHashingMinerCount;

                if(onlyNonHashing) {
                    minerCount = nonHashingMinerCount;
                }
                if(minerCount >= alertThreshold) {
                    // Find if editAmountButton exists and if so, hide it
                    const editAmountButton = document.getElementById('editAmountButton');
                    if (editAmountButton) {
                        editAmountButton.style.display = 'none';
                    }

                    // Create a notification element
                    const notification = document.createElement('div');
                    notification.className = 'miner-issue-notification';
                    notification.style.position = 'fixed';
                    notification.style.bottom = '20px';
                    notification.style.right = '20px';
                    notification.style.backgroundColor = '#333';
                    notification.style.color = '#fff';
                    notification.style.padding = '15px';
                    notification.style.borderRadius = '5px';
                    notification.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
                    notification.style.zIndex = '1000';
                    notification.style.transition = 'opacity 0.5s ease';

                    const closeButton = document.createElement('button');
                    closeButton.innerText = 'x';
                    closeButton.style.background = 'none';
                    closeButton.style.border = 'none';
                    closeButton.style.color = '#fff';
                    closeButton.style.fontSize = '16px';
                    closeButton.style.cursor = 'pointer';
                    closeButton.style.float = 'right';
                    closeButton.style.marginLeft = '10px';

                    closeButton.addEventListener('click', () => {
                        notification.style.opacity = '0';
                        setTimeout(() => notification.remove(), 500);

                        const editAmountButton = document.getElementById('editAmountButton');
                        if (editAmountButton) {
                            editAmountButton.style.display = 'block';
                            editAmountButton.style.opacity = '0';
                            editAmountButton.style.transition = 'opacity 0.5s ease';
                            setTimeout(() => editAmountButton.style.opacity = '1', 10);
                        }
                    });

                    notification.innerText = 'There are ' + allMiners + ' miners with issues.\n' + nonHashingMinerCount + ' are non hashing.\n' + lowHashingMinerCount + ' are low hashing.';
                    notification.appendChild(closeButton);
                    document.body.appendChild(notification);

                    // If at major alert amount, make the notification red & play a sound
                    if(minerCount >= majoralertThreshold && majorAlertEnable) {
                        notification.style.backgroundColor = 'red';
                        notification.style.color = 'white';
                        notification.style.fontWeight = 'bold';

                        document.body.click();
                        const audio = new Audio('https://cdn.freesound.org/previews/521/521973_311243-lq.mp3');
                        audio.play();

                        
                        var msg = new SpeechSynthesisUtterance();
                        msg.text = "There are " + allMiners + " miners with issues. " + nonHashingMinerCount + " are non hashing. " + lowHashingMinerCount + " are low hashing.";
                        window.speechSynthesis.speak(msg);

                        // if over 500, repeat the sound every 5 seconds for 60 seconds
                        if(minerCount >= 2000) {
                            const interval = setInterval(() => {
                                const audio1 = new Audio('https://cdn.freesound.org/previews/521/521973_311243-lq.mp3');
                                audio1.play();
                            }, 800);
                            setTimeout(() => clearInterval(interval), 60000);
                        }
                    }

                    // Edit button to be able to input custom notification amount
                    const editButton = document.createElement('button');
                    editButton.innerText = 'Edit';
                    editButton.style.background = 'none';
                    editButton.style.border = 'none';
                    editButton.style.color = '#fff';
                    editButton.style.fontSize = '16px';
                    editButton.style.cursor = 'pointer';
                    editButton.style.float = 'right';
                    editButton.style.marginLeft = '10px';

                    editButton.addEventListener('click', () => {
                        editalertThreshold();
                    });

                    notification.appendChild(editButton);

                    setTimeout(() => {
                        notification.style.opacity = '0';
                        setTimeout(() => notification.remove(), 500);
                        const editAmountButton = document.getElementById('editAmountButton');
                        if (editAmountButton) {
                            editAmountButton.style.display = 'block';
                            editAmountButton.style.opacity = '0';
                            editAmountButton.style.transition = 'opacity 0.5s ease';
                            setTimeout(() => editAmountButton.style.opacity = '1', 10);
                        }
                    }, 55000);
                }
            });
        }

        // Check if minden
        if( siteName.includes("Minden") ) {
            // Miner issue notification every minute
            setInterval(function() {
                minerIssueNotification()
            }, 60000);
            minerIssueNotification();
        }

        function retrieveMinerData(type, minerID, timeFrame, callback) {
            var params = {
                start: Math.floor(((new Date()).getTime() / 1000) - timeFrame),
                end: Math.floor((new Date()).getTime() / 1000),
                step: 300
            };

            serviceInstance.post("/"+type, Object.assign({ id: minerID }, params)).then((res) => {
                // Sanitize the data to only include the uptime values
                var retrievedData = res['data']['result'][0]['values']

                // Call the callback function for the uptime data
                if (callback) {
                    callback(minerID, retrievedData);
                }
            });
        }

        function createHashRateElements() {}

        function updateAllMinersData(keepTrying = false, callback) {
            console.log("Updating all miners data");
            // Reset allMinersLookup
            delete allMinersLookup;
            allMinersLookup = {};

            // Get the current site and company ID
            lastSiteId = siteId;
            lastCompanyId = companyId;

            viewServiceInstance = new MinerViewService();
            siteId = getSelectedSiteId();
            siteName = getSelectedSiteName();
            companyId = getSelectedCompanyId();

            // In case we swap company/site (Not actually sure if it matters for site, but might as well)
            __awaiter(this, void 0, void 0, function* () {
                serviceInstance.get(`/MinerInfo?siteId=${siteId}&zoneId=${-1}&zoneName=All%20Zones`)
                    .then((resp) => {

                    // Populate the minerSNLookup
                    let minerSNLookup = {};
                    //let scuffedTMIPs = "";
                    resp.miners.forEach(miner => {
                        minerSNLookup[miner.serialNumber] = {
                            minerID: miner.id,
                            slotID: miner.locationName.replace("Minden_", "")
                        };
                        allMinersLookup[miner.id] = miner;

                        // Get the ipAddress
                        if(miner.ipAddress != null) {
                            //scuffedTMIPs += "@connect " + miner.ipAddress + "\n";
                        }
                    });
                    //console.log(scuffedTMIPs);
                    if(siteName.includes("Minden")) {
                        GM_SuperValue.set("minerSNLookup", minerSNLookup);
                    }
                    delete minerSNLookup;

                    // Set the IP Address to "Lease Expired" if it's null
                    resp.miners.filter(miner => miner.ipAddress == null).forEach(miner => miner.ipAddress = "Lease Expired");

                    let miners = resp.miners;
                    //console.log("Miners Data:", miners);
    
                    if(keepTrying && Date.now() - lastMinerDataUpdate > 1000 && miners.length === 0) {
                        console.log("Retrying to get miner data");
                        setTimeout(function() {
                            updateAllMinersData(true);
                        }, 500);
                    }
                    
                    if(!disableFrozenMiners) {
                        // Sets up a lookup table
                        delete frozenMiners;
                        frozenMiners = [];
                        miners.forEach(miner => {
                            
                            // If the miner is frozen, add it to the frozen miners list
                            const minerID = miner.id;
                            const uptimeValue = miner.uptimeValue;
                            const lastUptimeData = lastUpTime[minerID] || { value: -1, time: -1, addedToList: false, lastHashRate: -1, sameHashRateCount: 0 };
                            const lastUptimeValue = lastUptimeData.value;
                            const lastUptimeTime = lastUptimeData.time;
                            const isHashing = miner.hashrate > 0;
                            const uptimeOverZero = uptimeValue > 0;
                            const minerOnline = miner.statusName === 'Online';
                            const notSameStatusUpdate = lastUptimeTime !== -1 && miner.lastStatsUpdate !== lastUptimeTime;
                            const sameBetweenChecks = uptimeValue === lastUptimeValue && notSameStatusUpdate;
                            const wasInListBefore = uptimeValue === lastUptimeValue && lastUptimeData.addedToList;
                            const sameHashRate = notSameStatusUpdate && lastUptimeData.lastHashRate === miner.hashrate;

                            if(!foundActiveMiners && (miner.statusName === 'Online' || miner.statusName === 'Offline')) {
                                activeMiners++;
                            }

                            if(notSameStatusUpdate) {
                                gotFrozenData = true;
                                gotFrozenDataFor[minerID] = true;
                            }
                            
                            lastUpTime[minerID] = { value: uptimeValue, time: miner.lastStatsUpdate };
                            if(sameHashRate) {
                                lastUpTime[minerID].sameHashRateCount++;
                            } else {
                                lastUpTime[minerID].sameHashRateCount = 0;
                            }

                            if (uptimeOverZero && isHashing && minerOnline && (sameBetweenChecks || wasInListBefore)) { // || lastUptimeData.sameHashRateCount > 2)) {
                                frozenMiners.push(miner);
                                lastUpTime[minerID].addedToList = true;
                            }

                            lastUpTime[minerID].lastHashRate = miner.hashrate;
                        });
                        GM_SuperValue.set("lastUpTime_"+siteName, lastUpTime);
                        foundActiveMiners = true;
                    }

                    // Get the miners data
                    allMinersData = [ ...miners ];

                    // Setup the hash rate elements
                    reloadCards = true;
                    createHashRateElements();

                    // Call the callback function if it exists
                    if (callback) {
                        callback(allMinersData);
                    }

                    delete miners;
                }).catch((error) => {
                    console.error("Error fetching miners data:", error);

                    if(keepTrying) {
                        console.log("Retrying to get miner data");
                        setTimeout(function() {
                            updateAllMinersData(true, callback);
                        }, 500);
                    }
                });
                
            });

            /*
            // Call the getMiners method
            viewServiceInstance.getMiners(companyId, siteId).then(function(miners) {
               
            }).catch(function(error) {
                
            });
            */
        }
        updateAllMinersData();

        function setupRefreshCheck() {
            // Looks for refreshing and then updates the hash rate elements
            const shadowRoot = document.querySelector('#refreshBtn').shadowRoot;
            const targetIcon = shadowRoot.querySelector('m-icon[name="refresh-cw"]');
            let currentTimeout = null;
            if (targetIcon) {
                const observer = new MutationObserver((mutationsList, observer) => {
                    for (const mutation of mutationsList) {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                            // Clear the timeout
                            if(currentTimeout) {
                                clearTimeout(currentTimeout);
                            }

                            // timeout checking if transform rotate is 0
                            currentTimeout = setTimeout(() => {
                                const transform = targetIcon.style.transform;
                                if(transform.includes('rotate(0deg)')) {
                                    updateAllMinersData();
                                }
                            }, 1000);
                        }
                    }
                });

                observer.observe(targetIcon, { attributes: true });
            } else {
                console.log('Target icon not found, trying again in 1 second.');
                setTimeout(setupRefreshCheck, 1000);
            }
        }
        setupRefreshCheck();

        function retrieveContainerTempData(callback) {
            serviceInstance.get(`/sensors?siteId=${siteId}`)
                .then((resp) => __awaiter(this, void 0, void 0, function* () {
                const sensors = resp.sensors;

                // Loop through all the sensors and get the average for each container
                /*
                {
                    "sensorId": 666,
                    "sensorName": "Container 1 Rack 12-13",
                    "facility": "Minden_C01",
                    "lastSample": "2024-09-20T03:03:22Z",
                    "temp": 69.23,
                    "humidity": 50.85,
                    "voltage": 3.01,
                    "isOnline": false
                }*/
                var containerTempData = {};
                for (const [index, sensor] of Object.entries(sensors)) {
                    var containerName = sensor.sensorName.split(' ')[1];
                    containerTempData[containerName] = containerTempData[containerName] || {
                        "temp": 0,
                        "count": 0
                    };

                    containerTempData[containerName].temp += sensor.temp;
                    containerTempData[containerName].count++;
                }

                // Loop through the containerTempData and get the average for each container
                for (const [containerName, data] of Object.entries(containerTempData)) {
                    containerTempData[containerName].temp = data.temp / data.count;
                }

                // Call the callback function for the container data
                if (callback) {
                    callback(containerTempData);
                }
            }));
        }

        let updatePlannerCardsData = function() {}; // Placeholder function for the actual function that will be created later
        
        getPlannerCardData = function() {
            // Open a pop out blank window
            const plannerCardWindow = window.open('', '_blank', 'width=800,height=600');
            plannerCardWindow.document.title = 'Planner Cards Data';
        
            // Create a nice looking dark theme for saying it's loading
            const style = `
                body {
                    background-color: #333;
                    color: #fff;
                    font-family: Arial, sans-serif;
                    font-size: 16px;
                    padding: 20px;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
                .overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: #333;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
                .spinner {
                    border: 6px solid #f3f3f3;
                    border-top: 6px solid #3498db;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    animation: spin 2s linear infinite;
                    margin-top: 20px;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .log {
                    position: relative;
                    width: 100%;
                    padding: 10px;
                    background-color: #333;
                    color: #fff;
                    font-family: Arial, sans-serif;
                    font-size: 16px;
                    z-index: 999999;
                    white-space: pre-wrap;
                    margin-top: 20px;
                }
                .finished {
                    position: relative;
                    width: 100%;
                    padding: 10px;
                    background-color: #4CAF50;
                    color: #fff;
                    font-family: Arial, sans-serif;
                    font-size: 24px;
                    text-align: center;
                    margin-top: 20px;
                }
            `;
            const styleElement = plannerCardWindow.document.createElement('style');
            styleElement.textContent = style;
            plannerCardWindow.document.head.appendChild(styleElement);
        
            // Create overlay with loading text and spinner
            const overlay = plannerCardWindow.document.createElement('div');
            overlay.className = 'overlay';
            const loadingText = plannerCardWindow.document.createElement('div');
            loadingText.textContent = 'Getting Planner Cards Data...';
            loadingText.style.zIndex = '999999';
            const loadingSpinner = plannerCardWindow.document.createElement('div');
            loadingSpinner.className = 'spinner';
            
            // Add a sleek dark background to the overlay
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            plannerCardWindow.document.body.appendChild(overlay);
            plannerCardWindow.document.body.appendChild(loadingText);
            plannerCardWindow.document.body.appendChild(loadingSpinner);
        
            // Check if the iframes already exist
            if (plannerCardWindow.document.querySelectorAll('.planner-iframe').length > 0) {
                return;
            }
        
            // Create the iframes for the planner boards
            let iframes = [];
            for (const key in urlLookupPlannerGrid) {
                const plannerID = getPlannerID(urlLookupPlanner[key]);
                GM_SuperValue.set("plannerPageLoaded_"+plannerID, false);
                GM_SuperValue.set("plannerCardsClosePage_"+plannerID, false);

                const iframe = plannerCardWindow.document.createElement('iframe');
                iframe.className = 'planner-iframe';
                iframes[plannerID] = iframe;
                iframe.src = urlLookupPlannerGrid[key];
                iframe.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: -1;
                `;
                plannerCardWindow.document.body.appendChild(iframe);
            }
        
            // Log element showing what planner cards have been located
            const logElement = plannerCardWindow.document.createElement('div');
            logElement.className = 'log';
            logElement.textContent = '';
            plannerCardWindow.document.body.appendChild(logElement);
        
            // Interval to check the data loaded
            let foundPlannerCards = [];
            let lastLength = 0;
            let lastLengthSameCount = 0;
            let collectionStarted = false;
            const checkDataInterval = setInterval(() => {
                const lastCollectionTime = GM_SuperValue.get('plannerCardsDataTime', 0);
                const currentTime = new Date().getTime();
                const timeDiff = (currentTime - lastCollectionTime) / 1000;
        
                if (timeDiff < 10 && !collectionStarted) {
                    collectionStarted = true;
                }
        
                if (!collectionStarted) {
                    return;
                }
        
                let plannerCardsDataAll = {};
                for (const key in urlLookupPlanner) {
                    const plannerID = getPlannerID(urlLookupPlanner[key]); //.match(/plan\/([^?]+)/)[1].split('/')[0];
                    const data = GM_SuperValue.get("plannerCardsData_" + plannerID, {});
                    plannerCardsDataAll = { ...plannerCardsDataAll, ...data };

                    // if plannerCardsClosePage_ is true, close the page
                    if(GM_SuperValue.get("plannerCardsClosePage_"+plannerID, false)) {
                        GM_SuperValue.set("plannerCardsClosePage_"+plannerID, false);
                        const iframe = iframes[plannerID];
                        iframe.remove();
                        return;
                    }
                }
        
                // Loop through the planner cards and add them to the log if they haven't been added yet
                for (const key in plannerCardsDataAll) {
                    if (!foundPlannerCards.includes(key)) {
                        foundPlannerCards.push(key);
                        //logElement.textContent = `Miner: ${key} card located. \n   -In column: ${plannerCardsDataAll[key].columnTitle}\n${logElement.textContent}`;
                    }
                }

                // Scroll to top of the page
                //plannerCardWindow.scrollTo(0, 0);
        
                // if all the iframes are closed
                if (plannerCardWindow.document.querySelectorAll('.planner-iframe').length === 0) {
                    clearInterval(checkDataInterval);
                    logElement.textContent = 'All planner cards located. Data collection complete.\n\n' + logElement.textContent;
                    // Remove the loading spinner and text
                    overlay.remove();

                    // Remove all the iframes
                    const iframes = plannerCardWindow.document.querySelectorAll('.planner-iframe');
                    iframes.forEach(iframe => iframe.remove());
        
                    // Put a 'Finished' in big green letters at top
                    const finishedText = plannerCardWindow.document.createElement('div');
                    finishedText.className = 'finished';
                    finishedText.textContent = 'Finished';
                    logElement.before(finishedText);

                    // Remove spinner and loading text
                    loadingText.remove();
                    loadingSpinner.remove();

                    
        
                    // Time out to close the window
                    setTimeout(() => {
                        plannerCardWindow.close();
                        updatePlannerCardsData();
                    }, 100);
                }
            }, 1000);
        }
        
        setInterval(function() {
            // Constantly checks if there siteId or companyId changes
            if(getSelectedSiteId() !== siteId || getSelectedCompanyId() !== companyId) {
                //updateAllMinersData(true);
                console.log("Site ID or Company ID has changed.");

                // Reload the page (Just far easier than trying to update the data and handle all the edge cases)
                window.location.reload();
            }
        }, 500);

        // ------------------------------

        function parseMinerDetails(text) {
            const details = {};
            const minerDetailsText = text.trim().split('\n');

            var lastKey = "";
            for (let i = 0; i < minerDetailsText.length; i++) {
                const key = minerDetailsText[i].trim();
                if (i + 1 < minerDetailsText.length && key.length > 2 && key != lastKey) {

                    let value = minerDetailsText[i + 1];
                    if (key === 'Rack / Row / Position') {
                        value = value.replace(/ \/ /g, '-');
                    }
                    details[key] = value;
                }
            }

            return details;
        }

        function getMinerDetails() {
            const container = document.querySelector('.miner-details-section.m-stack');
            if (!container) return;

            const clone = container.cloneNode(true);
            const buttons = clone.querySelectorAll('.copyBtn');
            buttons.forEach(btn => btn.remove());

            let cleanedText = cleanText(clone.innerText);
            var minerDetailsCrude = parseMinerDetails(cleanedText);

            const minerDetails = {
                model: minerDetailsCrude['Model'],
                serialNumber: minerDetailsCrude['Serial Number'],
                facility: minerDetailsCrude['Facility'],
                ipAddress: minerDetailsCrude['IpAddress'],
                locationID: minerDetailsCrude['Zone / Rack / Row / Position'].replace(/ \/ /g, "-"),
                activePool: minerDetailsCrude['Active Pool'],
                status: minerDetailsCrude['Status'],
                owner: minerDetailsCrude['Owner'],
            };

            return [cleanedText, minerDetails];
        }

        // Non-Bitcoin Hash Rate Logic
        if(currentUrl.includes("https://foundryoptifleet.com/Content/Dashboard/SiteOverview")) {

            // Hash Rate Types
            const hashRateTypes = {
                'H': 1,
                'KH': 1e3,
                'MH': 1e6,
                'GH': 1e9,
                'TH': 1e12,
                'PH': 1e15,
                'EH': 1e18,
                'ZH': 1e21,
            };

            // Function to convert hash rates between types
            function convertRates(hashRate, fromType, toType) {
                const hashRateFrom = hashRateTypes[fromType];
                const hashRateTo = hashRateTypes[toType];

                return (hashRate * hashRateFrom) / hashRateTo;
            }

            // Function to add another hash rate info element to the page
            function addHashRateInfoElement(title, totalHashRate, totalHashRatePotential, totalMiners) {

                // Run through the hash rate types until we find the best one to display
                var hashType = 'H';
                for (const [key, value] of Object.entries(hashRateTypes)) {
                    if (totalHashRate > value) {
                        hashType = key;
                    }
                }

                // Convert the hash rates to PHs
                totalHashRate = convertRates(totalHashRate, 'H', hashType).toFixed(2);
                totalHashRatePotential = convertRates(totalHashRatePotential, 'H', hashType).toFixed(2);

                // Get average hash rate per miner
                var averageHashRate = totalHashRate / totalMiners;

                // Calculate the efficiency
                var efficiency = (totalHashRate / totalHashRatePotential) * 100;
                efficiency = efficiency.toFixed(1);

                // Calculate the percentage of the total hash rate
                var totalHashRatePercentage = (totalHashRate / totalHashRatePotential) * 100;
                totalHashRatePercentage = totalHashRatePercentage.toFixed(1);

                const hashRateCard = document.createElement('div');
                hashRateCard.className = 'bar-chart-card custom';
                hashRateCard.innerHTML = `
                    <m-box class="bar-chart-card" data-dashlane-shadowhost="true" data-dashlane-observed="true">
                        <m-stack space="m" data-dashlane-shadowhost="true" data-dashlane-observed="true">
                            <div class="bar-chart-card-title">
                                <h3 class="m-heading is-size-l">${title}</h3>
                                <div>
                                    <div class="green-dot"></div>
                                    &nbsp;
                                </div>
                            </div>
                            <div class="bar-chart-section">
                                <h4 class="bar-chart-title m-heading is-size-xs">Total Hash Rate / Hash Rate Potential</h4>
                                <div class="bar-chart-row">
                                    <div class="bar-chart-container">
                                        <div class="bar-chart" id="hashRateBar_${title}" style="width: ${totalHashRatePercentage}%;">
                                            <div class="bar-chart-text">
                                                <span class="m-heading is-size-xs" id="hashRateBarVal_${title}">${totalHashRate}</span>
                                                <span class="m-heading is-size-xs" id="hashRateBarValUnits_${title}">${hashType}s</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="bar-chart-total">
                                        <span class="m-heading is-size-xs" id="hashRatePotential_${title}">${totalHashRatePotential}</span>
                                        <span class="m-heading is-size-xs is-muted" id="hashRatePotentialUnits_${title}">${hashType}s</span>
                                    </div>
                                </div>
                            </div>
                            <div class="metric-row">
                                <m-icon name="activity-square" size="xl" style="width: var(--size-icon-xl); height: var(--size-icon-xl);" data-dashlane-shadowhost="true" data-dashlane-observed="true"></m-icon>
                                &nbsp;&nbsp;
                                <span class="m-heading is-size-l is-muted">Efficiency:</span>&nbsp;&nbsp;
                                <span class="m-code is-size-l" id="hashRateEfficiency_${title}">${efficiency}%</span>
                            </div>
                        </m-stack>
                    </m-box>
                `;
                

                // Add a bit of margin to the top
                hashRateCard.style.marginTop = '0px';
                hashRateCard.style.marginBottom = '0px';

                // Find all 'bar-chart-card m-box' elements and add after the last one
                const lastCard = document.querySelectorAll('.bar-chart-card')[document.querySelectorAll('.bar-chart-card').length - 1];
                if (lastCard) {
                    lastCard.after(hashRateCard);
                } else {
                    console.error("Could not find last card to add after");
                }
                console.log("Added Hash Rate Info Element");
            }

            const unsupportedModels = {
                ["EquiHash"]:   ["Antminer Z15", "Antminer Z15j", "Antminer Z15e"],
                ["Scrypt"] :    ["Antminer L7"]
            };

            function removeAllHashRateElements() {
                const hashRateCards = document.querySelectorAll('.bar-chart-card.custom');
                hashRateCards.forEach(card => {
                    console.log("Deleted card:", card);
                    card.remove();
                });
            }

            // Function to loop through all miners, find the non-supported miners, calculate the hash rate and add the hash rate info element
            createHashRateElements = function() {

                // Keep checking until the miner data is updated
                if (!reloadCards) {
                    return;
                }
                reloadCards = false;

                var totalHashRates = {};
                /* Basic sudo structure
                {
                    "EquiHash": {
                        "totalHashRate": 0,
                        "totalHashRatePotential": 0,
                        "totalMiners": 0
                    },
                    "Scrypt": {
                        "totalHashRate": 0,
                        "totalHashRatePotential": 0,
                        "totalMiners": 0
                    }
                }
                */

                // Loop through all miners
                for (const [index, minerData] of Object.entries(allMinersData)) {
                    // Check if the miner is in the hash rate types
                    for (const [hashRateType, minerModels] of Object.entries(unsupportedModels)) {
                        if (minerModels.includes(minerData.modelName)) {
                            // Check if the miner is in the hash rate types
                            if (!totalHashRates[hashRateType]) {
                                totalHashRates[hashRateType] = {
                                    "totalHashRate": 0,
                                    "totalHashRatePotential": 0,
                                    "totalMiners": 0
                                };
                            }

                            // Add the hash rate to the total hash rate
                            totalHashRates[hashRateType].totalHashRate += minerData.hashrate;
                            totalHashRates[hashRateType].totalHashRatePotential += minerData.expectedHashRate;
                            totalHashRates[hashRateType].totalMiners++;
                        }
                    }
                }

                if (Object.keys(totalHashRates).length === 0) {
                    console.log("No miners found for hash rate types");
                    return;
                }

                // Find and delete all bar-chart-card m-box custom
                removeAllHashRateElements();

                // Loop through the total hash rates and add the hash rate info elements
                for (const [hashRateType, hashRateData] of Object.entries(totalHashRates)) {
                    addHashRateInfoElement("Hash Rate [" + hashRateType +"]", hashRateData.totalHashRate, hashRateData.totalHashRatePotential, hashRateData.totalMiners);
                }
            }

            // Call the function to create the hash rate elements
            createHashRateElements();
        }

        // SN Scanner Logic
        if(currentUrl.includes("https://foundryoptifleet.com/")) {

            // Check is the user ever inputs something
            var serialInputted = "";
            var lastInputTime = 0;
            var timeoutId;
            document.addEventListener('keydown', function(event) {

                // Get the focused element
                var activeElement = document.activeElement;

                // If the element contains editable or input in the class or has contenteditable, stop
                console.log(activeElement.tagName);
                if (activeElement && (activeElement.tagName === 'INPUT' ||
                activeElement.tagName === 'TEXTAREA' ||
                activeElement.tagName === 'SELECT' ||
                activeElement.isContentEditable) ||
                activeElement.contenteditable) {
                    console.log("stop");
                    return;
                }

                if(Date.now() - lastInputTime > 1000) {
                    serialInputted = "";
                } else {
                    serialInputted += event.key;

                    if (timeoutId) {
                        clearTimeout(timeoutId);
                    }


                    timeoutId = setTimeout(function() {
                        // Clean Shift and Enter
                        const originalSerialInputted = serialInputted;
                        serialInputted = serialInputted.replace(/Shift/g, '');
                        serialInputted = serialInputted.replace(/Enter/g, '');

                        // Count up how many times Shift is in the string and check if that many characters are in the cleaned string
                        const shiftCount = originalSerialInputted.split('Shift').length;
                        const serialInputtedNoNumbers = serialInputted.replace(/\d/g, '');
                        const shiftMatchCount = shiftCount === serialInputtedNoNumbers.length && shiftCount > 6;

                        //console.log("No Numbers:", serialInputtedNoNumbers);
                        //console.log("Original Serial Inputted:", originalSerialInputted);
                        //console.log("Shift Count:", shiftCount);
                        //console.log("Shift Match Count:", shiftMatchCount);


                        // Checks to see if there is Shift and Enter in the string, if not, stop
                        if ( !shiftMatchCount ) {
                            //console.log("No Enter/Shift or Low Length", serialInputted);
                            serialInputted = "";
                            return;
                        }

                        function createNotification(text) {
                            const notification = document.createElement('div');
                            notification.className = 'notification';
                            notification.style.cssText = `
                                position: fixed;
                                top: 10px;
                                right: 10px;
                                background-color: #dc3545;
                                color: #fff;
                                padding: 10px;
                                border-radius: 5px;
                                z-index: 999999;
                                transition: opacity 0.5s ease;
                                opacity: 1;
                            `;
                            notification.textContent = text;
                            document.body.appendChild(notification);

                            setTimeout(function() {
                                notification.style.opacity = '0';
                            }, 8000);
                        }

                        // if allMinersData is empty, notify the user that the data is still loading
                        if (Object.keys(allMinersData).length === 0) {
                            createNotification("Miner data is still loading, please wait a moment.");
                            return;
                        }

                        // Find the miner with the serial number
                        var minerID = false;
                        for (const [index, minerData] of Object.entries(allMinersData)) {
                            if(minerData.serialNumber === serialInputted) {
                                minerID = minerData.id;
                                break;
                            }
                        }

                        // If we found the miner, open the miner page
                        if(minerID) {
                            window.open(`https://foundryoptifleet.com/Content/Miners/IndividualMiner?id=${minerID}`).focus();
                        } else {
                            createNotification("Miner with serial number " + serialInputted + " not found.");

                            console.log("Miner with serial number", serialInputted, "not found.");
                        }
                    }, 500);
                }
                lastInputTime = Date.now();
            });
        }

        // Copy Miner Details Logic
        if (currentUrl.includes("foundryoptifleet.com/Content/Miners/IndividualMiner")) {
            console.log("Individual Miner Page");

            const styleSheet = `
            .copyBtn {
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 3px;
                padding: 3px 6px;
                font-size: 10px;
                margin-left: 10px;
                cursor: pointer;
                transition: background-color 0.3s ease;
                vertical-align: middle;
            }
            .copyBtn:hover {
                background-color: #45a049;
            }
            .copySuccess {
                background-color: #28a745;
                color: white;
                font-size: 12px;
                padding: 5px;
                border-radius: 3px;
                margin-top: 5px;
                display: inline-block;
                opacity: 0;
                transition: opacity 0.5s ease;
            }
            .copySuccess.show {
                opacity: 1;
            }
            .sharepointBtn {
                background-color: #0078d4; /* Blue color for SharePoint button */
            }
            .sharepointBtn:hover {
                background-color: #005a9e; /* Darker blue on hover */
            }
            `;

            const styleElement = document.createElement('style');
            styleElement.type = "text/css";
            styleElement.innerHTML = styleSheet;
            (document.head || document.documentElement).appendChild(styleElement);

            function copyTextToClipboard(text) {
                const tempTextArea = document.createElement('textarea');
                tempTextArea.value = text;
                document.body.appendChild(tempTextArea);
                tempTextArea.select();
                document.execCommand('copy');
                document.body.removeChild(tempTextArea);
            }

            // Clean Text fuction
            function cleanText(text) {
                console.log("Cleaning Text");
                console.log(text);
                return text
                .replace(/Copy\s*$/gm, '') // Remove 'Copy' button text
                .replace(/All details copied!/, '') // Remove 'All details copied!' message
                .replace(/Text copied!/, '') // Remove 'Text copied!' message
                .replace(/                /g, '') // Remove whitespacing
                .replace(/\n            \n            AutoPool Enabled\n/, '') // Remove the autopool text
                .replace(/\n+$/, '') // Remove trailing newlines
                .replace(/\n            \n            /g, '\n') // Removes extra new lines  )
                .trim();
            }

            function copyAllDetails() {
                const container = document.querySelector('.miner-details-section.m-stack');
                if (!container) return;

                const clone = container.cloneNode(true);
                const buttons = clone.querySelectorAll('.copyBtn');
                buttons.forEach(btn => btn.remove());

                let textToCopy = cleanText(clone.innerText);



                copyTextToClipboard(textToCopy);
            }

            function copyAllDetailsForSharepoint(onlyPlanner, issue, log, type, hbSerialNumber, hbModel, hbVersion, chainIssue, binNumber, skuID) {
                var [cleanedText, minerDetails] = getMinerDetails();
                console.log(minerDetails);
                const { model, serialNumber, facility, ipAddress, locationID, activePool, status } = minerDetails;
                let modelLite = model.replace('Antminer ', '');
                let modelLiteSplit = modelLite.split(' (');
                modelLite = modelLiteSplit[0];
                const hashRate = modelLiteSplit[1].replace(')', '');
                let modelWithoutParens = model.replace('(', '').replace(')', '');

                minerDetails['type'] = type;
                minerDetails['issue'] = issue;
                minerDetails['log'] = log;
                minerDetails['hashRate'] = hashRate;

                console.log(`${modelLite}_${hashRate}_${serialNumber}_${issue}`);
                console.log(cleanedText);

                console.log("Task Comment:", log);

                GM_SuperValue.set("taskName", `${serialNumber}_${modelLite}_${hashRate}_${issue}`);
                GM_SuperValue.set("taskNotes", cleanedText);
                GM_SuperValue.set("taskComment", log);
                GM_SuperValue.set("detailsData", JSON.stringify(minerDetails));

                const currentDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format
                let textToCopy = `${serialNumber}\t${modelLite}\t${hashRate}\t${issue}\t${status}\t${currentDate}`;

                if(type === "Fortitude") {
                    textToCopy = `${serialNumber}\t${modelWithoutParens}\t${hbSerialNumber}\t${hbModel}\t${hbVersion}\t${chainIssue}\t${binNumber}`;
                    GM_SuperValue.set("taskName", `${serialNumber}_${modelLite}_${hashRate}_${issue}_${skuID}`);
                }

                if(!onlyPlanner) {
                    copyTextToClipboard(textToCopy);
                    const sharePointLinks = {
                        "Bitmain": "https://foundrydigitalllc.sharepoint.com/:f:/s/SiteOps/EoZ4RPEfVj9EjKlBzWmVHVcBcqZQzo2BiBC8_eM0WoABiw?e=wOZWEz",
                        "Fortitude": "https://foundrydigitalllc.sharepoint.com/:f:/s/SiteOps/En56U6QoEzVCsNkYkXQOqxIBFLcql6OxnNJYBTX_r6ZIsw?e=oEb1JA",
                        "RAMM": "https://foundrydigitalllc.sharepoint.com/:f:/s/SiteOps/EsrLwwsTo8JCr2aO7FT924sBrQ-oP4Nehl8sFROGcirBwg?e=jKhBzT"
                    }

                    window.open(sharePointLinks[type]).focus();
                } else {
                    let plannerUrl = urlLookupPlanner[type];
                    window.open(plannerUrl).focus();
                }
                
            }

            function createDataInputPopup() {
                // Create a popup element for entering Issue and Log
                const popupElement = document.createElement('div');
                popupElement.innerHTML = `
                    <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: #333; color: white; padding: 20px;">
                        <h1>Enter Issue and Log</h1>
                        <form id="issueLogForm">
                            <div id="normalIssueContainer" style="margin-bottom: 10px;">
                                <label for="issue" style="display: block; font-weight: bold;">Issue:</label>
                                <input type="text" id="issue" name="issue" required style="width: 100%; padding: 5px; color: white;">
                            </div>
                            <div style="margin-bottom: 10px;">
                                <label for="log" style="display: block; font-weight: bold;">Comment/Log:</label>
                                <textarea id="log" name="log" required style="width: 100%; height: 100px; padding: 5px; color: white;"></textarea>
                            </div>
                            <div id="hbSerialNumberContainer" style="margin-bottom: 10px; display: none;">
                                <label for="hbSerialNumber" style="display: block; font-weight: bold;">HB Serial Number:</label>
                                <input type="text" id="hbSerialNumber" name="hbSerialNumber" style="width: 100%; padding: 5px; color: white;">
                            </div>
                            <div id="hbModelContainer" style="margin-bottom: 10px; display: none;">
                                <label for="hbModel" style="display: block; font-weight: bold;">HB Model:</label>
                                <input type="text" id="hbModel" name="hbModel" style="width: 100%; padding: 5px; color: white;">
                            </div>
                            <div id="hbVersionContainer" style="margin-bottom: 10px; display: none;">
                                <label for="hbVersion" style="display: block; font-weight: bold;">HB Version:</label>
                                <input type="text" id="hbVersion" name="hbVersion" style="width: 100%; padding: 5px; color: white;">
                            </div>
                            <div id="chainIssueContainer" style="margin-bottom: 10px; display: none;">
                                <label for="chainIssue" style="display: block; font-weight: bold;">Chain Issue:</label>
                                <input type="text" id="chainIssue" name="chainIssue" style="width: 100%; padding: 5px; color: white;">
                            </div>
                            <div id="binNumberContainer" style="margin-bottom: 10px; display: none;">
                                <label for="binNumber" style="display: block; font-weight: bold;">BIN#:</label>
                                <input type="text" id="binNumber" name="binNumber" style="width: 100%; padding: 5px; color: white;">
                            </div>
                            <div id="skuIDContainer" style="margin-bottom: 10px; display: none;">
                                <label for="skuID" style="display: block; font-weight: bold;">SKU:</label>
                                <input type="text" id="skuID" name="skuID" style="width: 100%; padding: 5px; color: white;">
                            </div>
                            <div style="margin-bottom: 10px;">
                                <label for="type" style="display: block; font-weight: bold;">Type:</label>
                                <select id="type" name="type" required style="width: 100%; padding: 5px; color: white; background-color: #222;">
                                    <option value="Bitmain">Bitmain</option>
                                    <option value="Fortitude">Fortitude</option>
                                    <option value="RAMM">RAMM</option>
                                </select>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <div>
                                    <button type="button" id="submitBtn1" style="background-color: #4CAF50; color: white; border: none; border-radius: 3px; padding: 5px 10px; cursor: pointer; transition: background-color 0.3s ease;">Sharepoint</button>
                                    <button type="button" id="submitBtn2" style="background-color: #4CAF50; color: white; border: none; border-radius: 3px; padding: 5px 10px; cursor: pointer; transition: background-color 0.3s ease; margin-left: 10px;">Planner</button>
                                    <button type="button" id="cancelBtn" style="background-color: #f44336; color: white; border: none; border-radius: 3px; padding: 5px 10px; cursor: pointer; transition: background-color 0.3s ease; margin-left: 10px;">Close</button>
                                </div>
                                <button type="button" id="linksBtn" style="background-color: #4287f5; color: white; border: none; border-radius: 3px; padding: 5px 10px; cursor: pointer; transition: background-color 0.3s ease;">Edit Links</button>
                            </div>
                        </form>
                    </div>
                `;

                // Whenever type is changed, update the inputs to hide/show based on the type
                popupElement.querySelector('#type').addEventListener('change', function() {
                    const type = this.value;
                    const hbSerialNumberContainer = popupElement.querySelector('#hbSerialNumberContainer');
                    const hbModelContainer = popupElement.querySelector('#hbModelContainer');
                    const hbVersionContainer = popupElement.querySelector('#hbVersionContainer');
                    const chainIssueContainer = popupElement.querySelector('#chainIssueContainer');
                    const binNumberContainer = popupElement.querySelector('#binNumberContainer');
                    const skuIDContainer = popupElement.querySelector('#skuIDContainer');

                    const normalIssueContainer = popupElement.querySelector('#normalIssueContainer');

                    if (type !== "Fortitude") {
                        hbSerialNumberContainer.style.display = 'none';
                        hbModelContainer.style.display = 'none';
                        hbVersionContainer.style.display = 'none';
                        chainIssueContainer.style.display = 'none';
                        binNumberContainer.style.display = 'none';
                        skuIDContainer.style.display = 'none';
                    } else {
                        hbSerialNumberContainer.style.display = 'block';
                        hbModelContainer.style.display = 'block';
                        hbVersionContainer.style.display = 'block';
                        chainIssueContainer.style.display = 'block';
                        binNumberContainer.style.display = 'block';
                        skuIDContainer.style.display = 'block';
                    }
                });

                // Hide the Edit Links button for the meantime
                popupElement.querySelector('#linksBtn').style.display = 'none';

                // Function to submit Issue and Log
                function submitIssueLog(onlyPlanner) {
                    const issue = document.getElementById("issue").value;
                    const log = document.getElementById("log").value;
                    const type = document.getElementById("type").value;

                    const hbSerialNumber = document.getElementById("hbSerialNumber").value;
                    const hbModel = document.getElementById("hbModel").value;
                    const hbVersion = document.getElementById("hbVersion").value;
                    const chainIssue = document.getElementById("chainIssue").value;
                    const binNumber = document.getElementById("binNumber").value;
                    const skuID = document.getElementById("skuID").value;

                    // Remove the popup element
                    //popupElement.remove();

                    // Copy the details for Quick Sharepoint & Planner and set the taskName and taskNotes
                    copyAllDetailsForSharepoint(onlyPlanner, issue, log, type, hbSerialNumber, hbModel, hbVersion, chainIssue, binNumber, skuID);
                }

                // Function to cancel Issue and Log
                function cancelIssueLog() {
                    // Remove the popup element
                    popupElement.remove();
                }

                // Function to edit links
                function editLinks() {
                    popupElement.remove();

                    // Creates a side panel element with links to Excel that can be edited and saved
                    const sidePanel = document.createElement('div');
                    const bitmainLink = urlLookupExcel["Bitmain"];
                    const fortitudeLink = urlLookupExcel["Fortitude"];
                    const rammLink = urlLookupExcel["RAMM"];
                    sidePanel.innerHTML = `
                        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: #333; color: white; padding: 20px;">
                            <h1>Edit Links</h1>
                            <form id="linksForm">
                                <div style="margin-bottom: 10px;">
                                    <label for="bitmain" style="display: block; font-weight: bold;">Bitmain:</label>
                                    <input type="text" id="bitmain" name="bitmain" required style="width: 100%; padding: 5px; color: white;" value="${bitmainLink}">
                                </div>
                                <div style="margin-bottom: 10px;">
                                    <label for="fortitude" style="display: block; font-weight: bold;">Fortitude:</label>
                                    <input type="text" id="fortitude" name="fortitude" required style="width: 100%; padding: 5px; color: white;" value="${fortitudeLink}">
                                </div>
                                <div style="margin-bottom: 10px;">
                                    <label for="ramm" style="display: block; font-weight: bold;">RAMM:</label>
                                    <input type="text" id="ramm" name="ramm" required style="width: 100%; padding: 5px; color: white;" value="${rammLink}">
                                </div>
                                <div style="display: flex; gap: 10px;">
                                    <button type="button" id="saveBtn" style="background-color: #4CAF50; color: white; border: none; border-radius: 3px; padding: 5px 10px; cursor: pointer; transition: background-color 0.3s ease;">Save</button>
                                    <button type="button" id="cancelBtn" style="background-color: #f44336; color: white; border: none; border-radius: 3px; padding: 5px 10px; cursor: pointer; transition: background-color 0.3s ease;">Cancel</button>
                                    <a href="${defaultExcelLink}" target="_blank" style="background-color: #0078d4; color: white; border: none; border-radius: 3px; padding: 5px 10px; cursor: pointer; transition: background-color 0.3s ease; text-decoration: none;">Site Ops</a>
                                </div>
                            </form>
                        </div>
                    `;
                    document.body.appendChild(sidePanel);

                    // Add event listeners to select text on focus
                    document.getElementById('bitmain').addEventListener('focus', function() {
                        this.select();
                    });
                    document.getElementById('fortitude').addEventListener('focus', function() {
                        this.select();
                    });
                    document.getElementById('ramm').addEventListener('focus', function() {
                        this.select();
                    });

                    function saveLinks() {
                        const bitmainLink = document.getElementById("bitmain").value;
                        const fortitudeLink = document.getElementById("fortitude").value;
                        const rammLink = document.getElementById("ramm").value;

                        GM_SuperValue.set("bitmainLink", bitmainLink !== "" ? bitmainLink : defaultExcelLink);
                        GM_SuperValue.set("fortitudeLink", fortitudeLink !== "" ? fortitudeLink : defaultExcelLink);
                        GM_SuperValue.set("rammLink", rammLink !== "" ? rammLink : defaultExcelLink);

                        urlLookupExcel["Bitmain"] = bitmainLink !== "" ? bitmainLink : defaultExcelLink;
                        urlLookupExcel["Fortitude"] = fortitudeLink !== "" ? fortitudeLink : defaultExcelLink;
                        urlLookupExcel["RAMM"] = rammLink !== "" ? rammLink : defaultExcelLink;
                        sidePanel.remove();
                    }

                    document.getElementById('saveBtn').addEventListener('click', saveLinks);
                    document.getElementById('cancelBtn').addEventListener('click', () => {
                        sidePanel.remove();
                    });
                }

                // Append the popup element to the document body
                document.body.appendChild(popupElement);

                // Attach event listeners to the buttons
                document.getElementById('submitBtn1').addEventListener('click', function() {
                    submitIssueLog(false);
                });
                document.getElementById('submitBtn2').addEventListener('click', function() {
                    submitIssueLog(true);
                });
                document.getElementById('cancelBtn').addEventListener('click', cancelIssueLog);
                document.getElementById('linksBtn').addEventListener('click', editLinks);
            }

            function addCopyButton(element, textToCopy) {
                if (element.querySelector('.copyBtn')) return;

                const copyButton = document.createElement('button');
                copyButton.innerText = 'Copy';
                copyButton.className = 'copyBtn';
                copyButton.onclick = function (event) {
                    event.preventDefault();
                    copyTextToClipboard(textToCopy);
                    copyButton.innerText = 'Copied';
                    setTimeout(() => {
                        copyButton.innerText = 'Copy';
                    }, 2000);
                };
                element.appendChild(copyButton);
            }

            function fixAccountWorkerFormatting() {
                const infoRows = document.querySelectorAll('.info-row');
                infoRows.forEach(row => {
                    const label = row.querySelector('.info-row-label');
                    const activeAccountLabel = row.querySelector('#activeAccount');
                    const activeWorkerLabel = row.querySelector('#activeWorker');
                    if (label && label.textContent.trim() === 'Account / Worker' && activeAccountLabel && activeWorkerLabel && activeAccountLabel.textContent && activeWorkerLabel.textContent) {

                        // print parent node
                        console.log(row.parentNode);

                        // Create new label
                        const newLabel = document.createElement('div');
                        newLabel.className = 'info-row-label';
                        newLabel.textContent = '\nAccount / Worker\n';

                        // Create new value div
                        const newValue = document.createElement('div');
                        newValue.className = 'info-row-value';
                        newValue.id = 'accountWorker';
                        newValue.textContent = activeAccountLabel.textContent + ' / ' + activeWorkerLabel.textContent;

                        // Create new info-row div
                        const newInfoRow = document.createElement('div');
                        newInfoRow.className = 'info-row';
                        newInfoRow.appendChild(newLabel);
                        newInfoRow.appendChild(newValue);

                        // Replace the old row with the new row
                        row.parentNode.replaceChild(newInfoRow, row);
                    }
                });
            }

            function addCopyButtonsToElements() {
                const detailSections = document.querySelectorAll('.miner-details-section .info-row-value');

                detailSections.forEach(section => {
                    const textToCopy = section.textContent.trim();
                    addCopyButton(section, textToCopy);
                });

                const container = document.querySelector('.miner-details-section.m-stack');
                if (container) {
                    if (!container.querySelector('.copyAllBtn')) {
                        const copyAllButton = document.createElement('button');
                        copyAllButton.innerText = 'Copy All';
                        copyAllButton.className = 'copyBtn copyAllBtn';
                        copyAllButton.onclick = function (event) {
                            event.preventDefault();
                            copyAllDetails();
                            //showSuccessMessage(container, "All details copied!");

                            // Change the button text to 'All details copied!' for 2 seconds
                            copyAllButton.innerText = 'All details copied!';
                            setTimeout(() => {
                                copyAllButton.innerText = 'Copy All';
                            }, 2000);
                        };
                        container.insertBefore(copyAllButton, container.firstChild);
                    }

                    if (!container.querySelector('.sharepointPasteBtn') && siteName.includes("Minden")) {
                        const sharepointPasteButton = document.createElement('button');
                        sharepointPasteButton.innerText = 'Quick Sharepoint & Planner';
                        sharepointPasteButton.className = 'copyBtn sharepointPasteBtn';
                        sharepointPasteButton.onclick = function (event) {
                            event.preventDefault();
                            createDataInputPopup();
                        };
                        container.insertBefore(sharepointPasteButton, container.firstChild);
                    }
                }
            }

            function showSuccessMessage(element, message) {
                let successMsg = document.createElement('div');
                successMsg.className = 'copySuccess';
                successMsg.innerHTML = message;
                element.appendChild(successMsg);
                setTimeout(() => {
                    successMsg.classList.add('show');
                    setTimeout(() => {
                        successMsg.classList.remove('show');
                        element.removeChild(successMsg);
                    }, 2000);
                }, 10);
            }

            function addMutationObserver() {
                const observer = new MutationObserver(() => {
                    fixAccountWorkerFormatting();
                    addCopyButtonsToElements();
                });

                observer.observe(document.body, { childList: true, subtree: true });
            }

            //addCopyButtonsToElements();
            addMutationObserver();
            
            // Add "Log" Tab
            const tabsContainer = document.querySelector('.tabs');
            const quickIPGrabTab = document.createElement('div');
            quickIPGrabTab.id = 'quickIPGrabTab';
            quickIPGrabTab.className = 'tab';
            quickIPGrabTab.custom = true;
            quickIPGrabTab.innerText = 'Current Log';
            quickIPGrabTab.style.float = 'right';
            quickIPGrabTab.style.cssText = `
                margin-left: auto;
                margin-right: 0px;
            `;
            quickIPGrabTab.onclick = function() {
                // Swaps to the selected tab
                $(this).addClass("selected");
                $(this).siblings(".tab").removeClass("selected");

                // Removes the active class from the other tab content
                let tabContent = document.querySelector('.tab-content');
                let children = tabContent.children;
                for (let i = 0; i < children.length; i++) {
                    children[i].classList.remove("active");
                }
                
                // Add the new data to the tab content (deletes if it already exists)
                const customTabContainer = document.createElement('div');
                customTabContainer.className = 'customTabContainer active';
                customTabContainer.style.display = 'flex';
                customTabContainer.style.flexDirection = 'column';
                customTabContainer.style.alignItems = 'center';
                customTabContainer.style.justifyContent = 'center';
                customTabContainer.style.height = '100%';
                customTabContainer.style.color = '#fff';

                const loadingText = document.createElement('div');
                loadingText.textContent = 'Retrieving data...';
                loadingText.style.marginBottom = '10px';
                customTabContainer.appendChild(loadingText);

                const loadingSpinner = document.createElement('div');
                loadingSpinner.style.border = '6px solid #f3f3f3';
                loadingSpinner.style.borderTop = '6px solid #3498db';
                loadingSpinner.style.borderRadius = '50%';
                loadingSpinner.style.width = '40px';
                loadingSpinner.style.height = '40px';
                loadingSpinner.style.animation = 'spin 2s linear infinite';
                customTabContainer.appendChild(loadingSpinner);

                tabContent.appendChild(customTabContainer);

                const style = document.createElement('style');
                style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                `;
                document.head.appendChild(style);

                // Get IP Address from m-link is-size-xs href
                const waitForIpElement = setInterval(() => {
                    const ipElement = document.querySelector('.m-link.is-size-xs');
                    if (ipElement && ipElement.href && ipElement.href.includes('http')) {
                        clearInterval(waitForIpElement);

                        // Get status from the miner
                        const status = getMinerDetails()[1].status;
                        
                        if(status !== "Online") {
                            // Remove the loading text and spinner
                            customTabContainer.removeChild(loadingText);
                            customTabContainer.removeChild(loadingSpinner);

                            // Add a clean nice message saying the miner is offline
                            const offlineMessage = document.createElement('div');
                            offlineMessage.textContent = 'Miner is currently offline.';
                            customTabContainer.appendChild(offlineMessage);
                            return;
                        }
                        
                        const ipHref = ipElement.href.replace('root:root@', '') + '/cgi-bin/log.cgi';
                        fetchGUIData(ipHref)
                            .then(responseText => {
                                // Remove the loading text and spinner
                                customTabContainer.removeChild(loadingText);
                                customTabContainer.removeChild(loadingSpinner);

                                // Create a sleek log element
                                const logElement = document.createElement('div');
                                logElement.style.cssText = `
                                    background-color: #18181b;
                                    color: #fff;
                                    padding: 20px;
                                    border-radius: 10px;
                                    max-height: 400px;
                                    overflow-y: auto;
                                    overflow-x: auto;
                                    font-family: 'Courier New', Courier, monospace;
                                    white-space: pre;
                                    width: 100%;
                                    scrollbar-width: thin;
                                    scrollbar-color: #888 #333;
                                `;
                                let orignalLogText = responseText.trim();
                                logElement.textContent = orignalLogText;
                                customTabContainer.appendChild(logElement);

                                // Add custom scrollbar styles
                                const style = document.createElement('style');
                                style.textContent = `
                                    ::-webkit-scrollbar {
                                        width: 8px;
                                        height: 8px;
                                    }
                                    ::-webkit-scrollbar-track {
                                        background: #333;
                                        border-radius: 10px;
                                    }
                                    ::-webkit-scrollbar-thumb {
                                        background-color: #888;
                                        border-radius: 10px;
                                        border: 2px solid #333;
                                    }
                                    ::-webkit-scrollbar-thumb:hover {
                                        background-color: #555;
                                    }
                                `;
                                document.head.appendChild(style);

                                // Scroll to bottom of log
                                logElement.scrollTop = logElement.scrollHeight;

                                // Create the error tabs
                                const logText = logElement.innerText;
                                var errorsFound = runErrorScanLogic(logText);
                                if(errorsFound.length === 0) {
                                    return;
                                }

                                // Add divider to m-nav
                                const mnav = document.querySelector('.m-nav');
                                const divider = document.createElement('div');
                                divider.className = 'm-divider has-space-m';
                                mnav.appendChild(divider);
            
                                function createErrorTab(title, errors, defaultOpen = false) {
                                    const errorTab = document.createElement('div');
                                    errorTab.className = 'm-nav-group';
                                    
                                    // Create the header with the dynamic title
                                    const header = `
                                        <div class="m-nav-group-header">
                                            <div class="m-nav-group-label">
                                                <m-icon name="error" size="l" data-dashlane-shadowhost="true" data-dashlane-observed="true"></m-icon>
                                                ${title}
                                            </div>
                                            <m-icon name="chevron-down" data-dashlane-shadowhost="true" data-dashlane-observed="true" class="flip"></m-icon>
                                        </div>
                                    `;
                                
                                    // Create the group items with icons dynamically
                                    const items = errors.map((error, index) => `
                                        <div class="m-nav-group-item" style="display: flex; align-items: center;">
                                            <img src="${error.icon}" width="16" height="16" style="margin-right: 8px;" />
                                            <a href="#" class="m-nav-item" data-error-index="${index}">${error.name}</a>
                                        </div>
                                    `).join('');
                                    
                                    // Combine all parts into the final HTML
                                    errorTab.innerHTML = `
                                        ${header}
                                        <div class="m-nav-group-section" style="display: none;">
                                            <div class="m-nav-group-items">
                                                ${items}
                                            </div>
                                        </div>
                                    `;
                                
                                    // Add collapse and open logic
                                    const headerElement = errorTab.querySelector('.m-nav-group-header');
                                    const sectionElement = errorTab.querySelector('.m-nav-group-section');
                                    const chevronIcon = errorTab.querySelector('.m-nav-group-header m-icon');
                                
                                    headerElement.addEventListener('click', () => {
                                        const isOpen = sectionElement.style.display === 'block';
                                        sectionElement.style.display = isOpen ? 'none' : 'block';
                                        chevronIcon.classList.toggle('flip', !isOpen);
                                    });

                                    if (defaultOpen) {
                                        sectionElement.style.display = 'block';
                                        chevronIcon.classList.add('flip');
                                    }
                                
                                    // Add click event listener to each error item
                                    const errorItems = errorTab.querySelectorAll('.m-nav-item');
                                    errorItems.forEach(item => {
                                        item.addEventListener('click', (event) => {
                                            event.preventDefault();
                                            const errorIndex = event.target.getAttribute('data-error-index');
                                            const error = errors[errorIndex];
                                            handleErrorClick(error, orignalLogText);
                                        });
                                    });
                                
                                    mnav.appendChild(errorTab);
                                }
                                
                                function handleErrorClick(error, orignalLogText) {
                                    // Reset log text
                                    while (logElement.firstChild) {
                                        logElement.removeChild(logElement.firstChild);
                                    }
                                    logElement.textContent = orignalLogText;
                                
                                    // Create a new element to highlight the error
                                    const errorElement = document.createElement('span');
                                    errorElement.style.backgroundColor = '#FF2323';
                                    
                                    const errorTextNode = document.createElement('span');
                                    errorTextNode.style.fontWeight = 'bolder';
                                    errorTextNode.style.textShadow = '1px 1px 2px black';
                                    errorTextNode.style.color = 'white';
                                    errorTextNode.textContent = error.text;
                                    errorElement.appendChild(errorTextNode);
                                    errorElement.style.width = '100%';
                                    errorElement.style.display = 'block';
                                
                                    // Create a copy button
                                    const copyButton = document.createElement('button');
                                    copyButton.textContent = 'Copy';
                                    copyButton.style.position = 'absolute';
                                    copyButton.style.bottom = '0';
                                    copyButton.style.right = '0';
                                    copyButton.style.backgroundColor = 'transparent';
                                    copyButton.style.border = 'none';
                                    copyButton.style.color = 'black';
                                    copyButton.style.cursor = 'pointer';
                                    copyButton.style.padding = '5px';
                                    copyButton.style.fontSize = '12px';
                                    copyButton.style.fontWeight = 'bold';
                                    copyButton.style.zIndex = '1';
                                    copyButton.addEventListener('click', () => {
                                        // disable default behavior
                                        event.preventDefault();

                                        // copy text to clipboard
                                        if (navigator.clipboard) {
                                            navigator.clipboard.writeText(error.text).then(() => {
                                                console.log('Text copied to clipboard');
                                            }).catch(err => {
                                                console.error('Failed to copy text: ', err);
                                            });
                                        } else {
                                            const textArea = document.createElement('textarea');
                                            textArea.value = error.text;
                                            document.body.appendChild(textArea);
                                            textArea.select();
                                            try {
                                                document.execCommand('copy');
                                                console.log('Text copied to clipboard');
                                            } catch (err) {
                                                console.error('Failed to copy text: ', err);
                                            }
                                            document.body.removeChild(textArea);
                                        }
                                        copyButton.textContent = 'Copied!';
                                        setTimeout(() => {
                                            copyButton.textContent = 'Copy';
                                        }, 1000);
                                    });
                                
                                    errorElement.style.position = 'relative';
                                    errorElement.appendChild(copyButton);
                                
                                    errorElement.addEventListener('mouseover', () => {
                                        copyButton.style.display = 'block';
                                    });
                                
                                    errorElement.addEventListener('mouseout', () => {
                                        copyButton.style.display = 'none';
                                    });
                                
                                    copyButton.addEventListener('mouseover', () => {
                                        copyButton.style.color = 'green';
                                    });
                                
                                    copyButton.addEventListener('mouseout', () => {
                                        copyButton.style.color = 'black';
                                    });
                                
                                    // Replace the error text in the log with the highlighted version
                                    const logTextNode = logElement.childNodes[0];
                                    const beforeErrorText = logTextNode.textContent.substring(0, error.start);
                                    const afterErrorText = logTextNode.textContent.substring(error.end);

                                    logTextNode.textContent = beforeErrorText;
                                    
                                    logElement.insertBefore(errorElement, logTextNode.nextSibling);
                                    logElement.insertBefore(document.createTextNode(afterErrorText), errorElement.nextSibling);
                                    errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }
                                

                                createErrorTab("Main Errors", errorsFound.filter(error => !error.unimportant), true);
                                createErrorTab("Other Errors", errorsFound.filter(error => error.unimportant));
                            })
                            .catch(error => {
                                console.error(error);
                            });
                    }
                }, 500);


                /*
                // Get id from url
                const urlParams = new URLSearchParams(window.location.search);
                const minerID = urlParams.get('id').toString();
                console.log("Miner ID:", minerID);

                let waitForMinerData = setInterval(() => {
                    // Make sure allMinersData is loaded
                    if (Object.keys(allMinersLookup).length > 0) {
                        clearInterval(waitForMinerData);
                    } else {
                        return;
                    }

                    // Get the miner data
                    const currentMiner = allMinersLookup[minerID];
                    console.log(currentMiner);
                    const minerIP = currentMiner.ipAddress;

                    // Start scan logic
                    GM_SuperValue.set('errorsFound', {});
                    let guiLink = `http://root:root@${minerIP}/#blog`;
                    if(currentMiner.firmwareVersion.includes('BCFMiner')) {
                        guiLink = `http://root:root@${minerIP}/#/logs`;
                    }
                    GM_SuperValue.set('currentlyScanning', {[minerIP]: currentMiner});
                    let logWindow = window.open(guiLink, '_blank', 'width=1,height=1,left=0,top=' + (window.innerHeight - 400));

                    // Wait for the miner gui to load
                    let loaded = false;
                    let currentCheckLoadedInterval = setInterval(() => {
                        const errorsFound = GM_SuperValue.get('errorsFound', false);
                        if(errorsFound && errorsFound[currentMiner.id]) {
                            loaded = true;
                            const minerErrors = errorsFound[currentMiner.id] || [];
                            clearInterval(currentCheckLoadedInterval);
                            
                            GM_SuperValue.set('currentlyScanning', {});

                            // Close the log window
                            logWindow.close();

                            // Remove the loading spinner and text
                            customTabContainer.removeChild(loadingText);
                            customTabContainer.removeChild(loadingSpinner);

                            // Create a list of errors
                            const errorList = document.createElement('div');
                            errorList.style.width = '100%';
                            errorList.style.maxHeight = 'calc(100% - 50px)';
                            errorList.style.overflowY = 'auto';
                            errorList.style.padding = '20px';
                            errorList.style.border = '1px solid #444';
                            errorList.style.borderRadius = '10px';
                            errorList.style.marginTop = '20px';
                            errorList.style.backgroundColor = '#222';
                            errorList.style.display = 'flex';
                            errorList.style.flexDirection = 'column';
                            errorList.style.alignItems = 'center';

                            const errorTitle = document.createElement('h2');
                            errorTitle.textContent = 'Errors Found';
                            errorTitle.style.marginBottom = '20px';
                            errorTitle.style.color = '#fff';
                            errorList.appendChild(errorTitle);

                            minerErrors.forEach(error => {
                                const errorContainer = document.createElement('div');
                                errorContainer.style.display = 'flex';
                                errorContainer.style.alignItems = 'center';
                                errorContainer.style.width = '100%';
                                errorContainer.style.padding = '10px';
                                errorContainer.style.marginBottom = '10px';
                                errorContainer.style.borderBottom = '1px solid #444';

                                const errorIcon = document.createElement('img');
                                errorIcon.src = error.icon;
                                errorIcon.style.width = '40px';
                                errorIcon.style.height = '40px';
                                errorIcon.style.marginRight = '20px';
                                errorContainer.appendChild(errorIcon);

                                const errorText = document.createElement('div');
                                errorText.style.display = 'flex';
                                errorText.style.flexDirection = 'column';
                                errorText.style.width = '100%';

                                const errorName = document.createElement('h3');
                                errorName.textContent = error.name;
                                errorName.style.marginBottom = '5px';
                                errorName.style.color = '#fff';
                                errorText.appendChild(errorName);

                                const errorShort = document.createElement('p');
                                errorShort.textContent = error.short;
                                errorShort.style.marginBottom = '5px';
                                errorShort.style.color = '#bbb';
                                errorText.appendChild(errorShort);

                                var questionColor = 'red';
                                if(questionColor) {
                                    row.querySelector('td:last-child div[style*="position: relative;"] div').style.backgroundColor = questionColor;   
                                }
                                
                                // Add hover event listeners to show/hide the full details
                                const questionMark = row.querySelector('td:last-child div[style*="position: relative;"]');
                                const tooltip = questionMark.querySelector('div[style*="display: none;"]');
                                document.body.appendChild(tooltip);
                                questionMark.addEventListener('mouseenter', () => {
                                    tooltip.style.display = 'block';

                                    // Position the tooltip to the left of the question mark with the added width
                                    const questionMarkRect = questionMark.getBoundingClientRect();
                                    const tooltipRect = tooltip.getBoundingClientRect();
                                    tooltip.style.left = `${questionMarkRect.left - tooltipRect.width}px`;
                                    tooltip.style.right = 'auto';

                                    // Set top position to be the same as the question mark
                                    tooltip.style.top = `${questionMarkRect.top}px`;
                                });

                                // when clicked, open the error log
                                questionMark.addEventListener('click', () => {
                                    const ip = currentMiner.ipAddress;
                                    GM_SuperValue.set('quickGoToLog', {ip: ip, errorText: error.text, category: error.category});
                                    window.open(guiLink, '_blank');
                                });

                                
                                // Start a timer to hide the tooltip after a delay if not hovered over
                                let hideTooltipTimer;
                                const hideTooltipWithDelay = () => {
                                    hideTooltipTimer = setTimeout(() => {
                                        tooltip.style.display = 'none';
                                    }, 100);
                                };

                                tooltip.style.display = 'none';

                                // Clear the timer if the tooltip or question mark is hovered over again
                                questionMark.addEventListener('mouseenter', () => {
                                    clearTimeout(hideTooltipTimer);
                                });

                                tooltip.addEventListener('mouseenter', () => {
                                    clearTimeout(hideTooltipTimer);
                                });

                                // Start the timer when the mouse leaves the tooltip or question mark
                                questionMark.addEventListener('mouseleave', hideTooltipWithDelay);
                                tooltip.addEventListener('mouseleave', hideTooltipWithDelay);

                                // Observe for changes to the table and delete the tooltip if so
                                const observer = new MutationObserver(() => {
                                    tooltip.remove();
                                    observer.disconnect();
                                });

                                observer.observe(row, { childList: true });

                                errorContainer.appendChild(errorText);
                                errorList.appendChild(errorContainer);
                            });

                            customTabContainer.appendChild(errorList);
                        }
                    }, 10);

                    setTimeout(() => {
                        if (!loaded && currentCheckLoadedInterval) {
                            let failText = "Failed to load miner GUI.";
                            if(currentMiner.firmwareVersion.includes('BCFMiner')) {
                                failText = "Failed to load miner GUI or got stuck on Username/Password prompt.";
                            }

                            clearInterval(currentCheckLoadedInterval);

                            const errorsFound = GM_SuperValue.get('errorsFound', {});
                            errorsFound[currentMiner.id] = [{
                                name: failText,
                                short: "GUI Load Fail",
                                icon: "https://img.icons8.com/?size=100&id=111057&format=png&color=FFFFFF"
                            }];
                            GM_SuperValue.set('errorsFound', errorsFound);
                            GM_SuperValue.set('currentlyScanning', {});

                            // Close the log window
                            logWindow.close();
                        }
                    }, 16000);
                }, 200);
                
                */
            };
            
            tabsContainer.appendChild(quickIPGrabTab);

            // Loop through all the tabs and add an extra on click event 
            const tabs = document.querySelectorAll('.tab');
            tabs.forEach(tab => {
                tab.addEventListener('click', function(event) {
                    // Remove the custom tab content
                    let tabContent = document.querySelectorAll('.customTabContainer');
                    tabContent.forEach(content => {
                        content.remove();
                    });
                }, true);
            });
        }

        //--------------------------------------------
        // Scan Logic/Auto Reboot Logic
        if(currentUrl.includes("https://foundryoptifleet.com/Content/Issues/Issues")) {

            // -- Add Breaker Number to Slot ID --

            var minersListTableLookup = {};

            function getCurrentMinerList(baseDocument) {
                if(!baseDocument) {
                    baseDocument = document;
                }

                var minerGrid = baseDocument.querySelector('#minerList');
                if (!minerGrid) {
                    minerGrid = baseDocument.querySelector('#minerGrid');
                }

                if (minerGrid) {
                    // Loop through all the columns and store the index for each column & name
                    var columnIndexes = {};
                    const gridHeader = minerGrid.querySelector('.k-grid-header');
                    var columns = Array.from(gridHeader.querySelector('[role="row"]').children);
                    columns.forEach((column, index) => {
                        // Get the title of the column, and store the index
                        const title = column.getAttribute('data-title');
                        columnIndexes[title] = index;
                    });

                    const rows = minerGrid.querySelectorAll('[role="row"]');
                    // Loop through all the rows and store the data for each miner
                    rows.forEach(row => {
                        const uid = row.getAttribute('data-uid');
                        let minerLinkElement = minerGrid.querySelector(`[data-uid="${uid}"] .menu-wrapper`);
                        
                        // for first index add a link icon element that opens the miner page
                        if(minerLinkElement && !minerLinkElement.addedLinkIcon) {
                            minerLinkElement.addedLinkIcon = true;
                            const linkIcon = document.createElement('a');
                            linkIcon.href = `https://foundryoptifleet.com/Content/Miners/IndividualMiner?id=${minerLinkElement.getAttribute('data-miner-id')}`;
                            linkIcon.target = '_blank';
                            linkIcon.style.cursor = 'pointer';
                            linkIcon.style.marginRight = '5px';
                            linkIcon.style.width = '24px';
                            linkIcon.style.height = '24px';
                            linkIcon.style.verticalAlign = 'middle';
                            linkIcon.oncontextmenu = function(event) {
                                event.stopPropagation(); // Prevent the custom context menu from opening
                            };
                            linkIcon.onclick = function(event) {
                                event.stopPropagation(); // Prevent the custom context menu from opening
                            };

                            const img = document.createElement('img');
                            img.src = 'https://img.icons8.com/?size=100&id=82787&format=png&color=FFFFFF';
                            img.style.width = '100%';
                            img.style.height = '100%';
                            linkIcon.appendChild(img);

                            minerLinkElement.prepend(linkIcon);

                            // Delete the default 3 dots icon
                            const defaultIcon = minerLinkElement.querySelector('m-icon[name="more-vertical"]');
                            if (defaultIcon) {
                                defaultIcon.style.display = 'none';
                            }

                            row.addEventListener('contextmenu', (event) => {
                                event.preventDefault();
                                defaultIcon.click();

                                // Find the context menu (id issueMenu) and move it to the mouse position
                                const contextMenu = document.getElementById('issueMenu');
                                if (contextMenu) {
                                    contextMenu.style.position = 'fixed';
                                    contextMenu.style.top = event.clientY + 'px';
                                    contextMenu.style.left = event.clientX + 'px';

                                    // If it goes off the screen, move it back on
                                    if (event.clientX + contextMenu.offsetWidth > window.innerWidth) {
                                        contextMenu.style.left = (window.innerWidth - contextMenu.offsetWidth) + 'px';
                                    }
                                    if (event.clientY + contextMenu.offsetHeight > window.innerHeight) {
                                        contextMenu.style.top = (window.innerHeight - contextMenu.offsetHeight) + 'px';
                                    }
                                }
                            });
                        }

                        // Loop through columnIndexes and get the data for each column
                        for (const [key, colIndex] of Object.entries(columnIndexes)) {
                            let colRowElement = row.querySelector('td[role="gridcell"]:nth-child(' + (parseInt(colIndex+1)) + ')');
                            if (minerLinkElement && colRowElement) {
                                // Store the data in the minersListTableLookup 
                                const minerID = minerLinkElement.getAttribute('data-miner-id');
                                minersListTableLookup[minerID] = minersListTableLookup[minerID] || {};
                                minersListTableLookup[minerID][key] = colRowElement;
                            }
                        }
                    });
                }
            }

            // Wait until HTML element with #minerList is loaded
            function addBreakerNumberToSlotID() {
                const minerListCheck = setInterval(() => {
                    const minerList = document.querySelector('#minerList');
                    if (minerList) {
                        clearInterval(minerListCheck);
                        
                        
                        let plannerCardsDataAll = {};
                        function updatePlannerLink(plannerElement) {
                            
                            let lastCollectionTime = GM_SuperValue.get('plannerCardsDataTime', 0);
                            let currentTime = new Date().getTime();
                            let timeDiff = (currentTime - lastCollectionTime) / 1000;
                            const plannerCardConfig = GM_SuperValue.get('plannerCardConfig', {autoRetrieve: false, openOnLoad: false, retrieveInterval: 60*4});
                            const retrievalInterval = plannerCardConfig.retrieveInterval*60;
                            if (timeDiff > retrievalInterval) {
                                plannerElement.textContent = '';

                                // Remove the clickable link stuff
                                plannerElement.style.cursor = 'default';
                                plannerElement.onclick = null;
                                plannerElement.style.color = 'white';
                                plannerElement.style.textDecoration = 'none';
                                return;
                            }

                            let serialNumber = plannerElement.getAttribute('data-serial-number');
                            let cardData = plannerCardsDataAll[serialNumber];
                            if (cardData) {
                                let columnTitle = cardData.columnTitle;
                                plannerElement.textContent = columnTitle;

                                // Make it a clickable link
                                plannerElement.style.cursor = 'pointer';
                                plannerElement.onclick = function() {
                                    GM_SuperValue.set("locatePlannerCard", {
                                        serialNumber: serialNumber,
                                        columnTitle: columnTitle
                                    });

                                    var url = cardData.url;
                                    window.open(url, '_blank');
                                };

                                // Make it blue and underlined
                                plannerElement.style.color = '#0078d4';
                                plannerElement.style.textDecoration = 'underline';
                            } else {
                                plannerElement.textContent = 'No Card Found';

                                // Remove the clickable link stuff
                                plannerElement.style.cursor = 'default';
                                plannerElement.onclick = null;
                                plannerElement.style.color = 'white';
                                plannerElement.style.textDecoration = 'none';
                            }
                        }

                        updatePlannerCardsData = function() {
                            console.log("Updating Planner Cards Data");
                            for(var key in urlLookupPlanner) {
                                let plannerID = getPlannerID(urlLookupPlanner[key]); //.match(/plan\/([^?]+)/)[1].split('/')[0];
                                let collectDataSuperValueID = "plannerCardsData_" + plannerID;
                                let data = GM_SuperValue.get(collectDataSuperValueID, {});
                                // combine into plannerCardsData
                                plannerCardsDataAll = {...plannerCardsDataAll, ...data};
                            }

                            // Loop through all planner-elements and update the text
                            const plannerElements = document.querySelectorAll('.planner-element');
                            for (const plannerElement of plannerElements) {
                                updatePlannerLink(plannerElement);
                            }
                        }
                        updatePlannerCardsData();
                        const updateCardList = setInterval(() => {
                            updatePlannerCardsData();
                        }, 10000);
                        
                        // Add mutation observer to the minerList
                        const observer = new MutationObserver(() => {
                            getCurrentMinerList();
                            
                            // Loop through all the Slot ID elements and add the Breaker Number and Container Temp
                            for (const [minerID, minerData] of Object.entries(minersListTableLookup)) {
                                const modelCell = minerData['Model'];
                                const slotIDCell = minerData['Slot ID'];
                                const statusCell = minerData['Status'];

                                // Get the serial number from the model cell, second child is the serial number
                                const serialNumber = modelCell.children[1].innerText;
                                const slotID = slotIDCell.innerText;
                                const status = statusCell.innerText;
                                //console.log("serialNumber", serialNumber);

                                // Check if slotID has minden in it
                                if (!slotID.includes('Minden')) {
                                    continue;
                                }

                                var splitSlotID = slotID.split('-');
                                var row = Number(splitSlotID[2]);
                                var col = Number(splitSlotID[3]);
                                var rowWidth = 4;
                                var breakerNum = (row-1)*rowWidth + col;

                                // if breakerNum isn't NAN
                                if (!isNaN(breakerNum)) {
                                    var newElement = document.createElement('div');
                                    newElement.textContent = 'Breaker Number: ' + breakerNum;
                                    minerData['Slot ID'].appendChild(newElement);
                                }

                                // Add the Planner Link too
                                if (!statusCell.querySelector('.planner-element')) {
                                    var plannerElement = document.createElement('div');
                                    plannerElement.textContent = 'Planner Card: Checking...';
                                    plannerElement.classList.add('planner-element');
                                    plannerElement.setAttribute('data-serial-number', serialNumber);
                                    statusCell.appendChild(plannerElement);

                                    updatePlannerLink(plannerElement);
                                }
                            }
                            
                            // Container Temp
                            retrieveContainerTempData((containerTempData) => {
                                for (const [minerID, minerData] of Object.entries(minersListTableLookup)) {
                                    const slotID = minerData['Slot ID'].textContent;
                                    var containerText = slotID.split("_")[1].split("-")[0].replace(/\D/g, '');
                                    var containerNum = containerText.replace(/^0+/, '');
        
                                    // Check if slotID has minden in it
                                    if (!slotID.includes('Minden')) {
                                        continue;
                                    }
                                    // This is very broken and messed up now
                                    const containerTemp = containerTempData[containerNum].temp.toFixed(2);
                                    let statsElement = minerData['Stats'].querySelector('.miner-stats');
                                    if(!statsElement) {
                                        statsElement = minerData['Stats'];
                                    }
                                    let curTextContent = "";
                                    if(statsElement.children.length > 0) {
                                        curTextContent = statsElement.children[0].textContent;
                                    }
                                    // random test number between 0 and 100
                                    if (containerTemp && !curTextContent.includes('C')) { // doesn't contain added text already
                                     
                                        //statsElement.children[0].textContent = "Boards: " + curTextContent;

                                        var newElement = document.createElement('div');
                                        newElement.innerHTML = `<span>C${containerText}:</span> <span>${containerTemp}F</span>`;
                                        statsElement.prepend(newElement);

                                        // Set the text color of the temp based on the container temp
                                        const tempSpans = newElement.querySelectorAll('span');
                                        const tempSpan1 = tempSpans[0];
                                        const tempSpan2 = tempSpans[1];
                                        tempSpan1.style.color = '#B2B2B8';
                                        if (containerTemp > 80) {
                                            tempSpan2.style.color = 'red';
                                            tempSpan2.textContent += ' 🔥';
                                        } else if (containerTemp > 70) {
                                            tempSpan2.style.color = 'yellow';
                                            tempSpan2.textContent += ' ⚠️';
                                        } else if (containerTemp <= 25) {
                                            tempSpan2.style.color = '#38a9ff';
                                            tempSpan2.textContent += ' ❄️';
                                        } else {
                                            tempSpan2.style.color = 'white';
                                        }
                                    }
                                }
                            });  
                        });
                        observer.observe(minerList, { childList: true, subtree: true });
                    }
                }, 500);
            }
            addBreakerNumberToSlotID();

            // -- Scan Logic --
            var scanTimeFrameText;

            // Find the issuesActionsDropdown and add a new action
            const interval = setInterval(() => {

                // Make a second Actions button for different scan times
                const actionsDropdown = document.querySelector('.op-dropdown')
                if (actionsDropdown) {
                    clearInterval(interval);

                    // Create a new dropdown element
                    const newActionsDropdown = document.createElement('div');
                    newActionsDropdown.classList.add('op-dropdown');
                    newActionsDropdown.style.display = 'inline-block';
                    newActionsDropdown.innerHTML = `
                        <button id="btnNewAction" type="button" class="m-button" onclick="issues.toggleDropdownMenu('newActionsDropdown'); return false;">
                            Down Scans
                            <m-icon name="chevron-down" class="button-caret-down" data-dashlane-shadowhost="true" data-dashlane-observed="true"></m-icon>
                        </button>
                        <div id="newActionsDropdown" class="m-dropdown-menu is-position-right" aria-hidden="true">
                            <div class="m-menu">
                                <div class="m-menu-item" onclick="lastHourScan()">
                                    Scan Last Hour
                                </div>
                                <div class="m-menu-item" onclick="last4HourScan()">
                                    Scan Last 4 Hours
                                </div>
                                <div class="m-menu-item" onclick="last24HourScan()">
                                    Scan Last 24 Hours
                                </div>
                                <div class="m-menu-item" onclick="last7DayScan()">
                                    Scan Last 7 Days
                                </div>
                                <div class="m-menu-item" onclick="last30DayScan()">
                                    Scan Last 30 Days
                                </div>
                            </div>
                        </div>
                    `;

                    // Put the new dropdown before the original dropdown
                    actionsDropdown.before(newActionsDropdown);

                    function createPopUpTable(title, cols, parent, callback) {
                        // Check if there is an existing #minerTable, if so, click the first tab (assumingly it is the extra tab tables I've made)
                        const existingTable = document.getElementById('minerTable');
                        if (existingTable) {
                            const tabs = document.querySelectorAll('.tab');
                            const firstTab = tabs[0];
                            if (firstTab) {
                                firstTab.click();
                            }
                        }

                        let popupResultElement = document.createElement('div');
                        let position = 'fixed';
                        let top = '50%';
                        let left = '50%';
                        let transform = 'translate(-50%, -50%)';
                        let width = '80%';
                        let height = '80%';
                        let display = 'flex';
                        if (parent) {
                            position = 'relative';
                            top = '0';
                            left = '0';
                            transform = '';
                            width = '100%';
                            height = '100%';
                            display = 'block';
                        }
                        popupResultElement.innerHTML = `
                            <div style="
                                position: ${position};
                                top: ${top};
                                left: ${left};
                                transform: ${transform};
                                background-color: #333;
                                color: white;
                                padding: 20px;
                                font-family: Arial, sans-serif;
                                border-radius: 5px;
                                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
                                width: ${width};
                                height: ${height};
                                display: ${display};
                                flex-direction: column;
                                justify-content: center;
                                align-items: center;
                                z-index: 9999;
                            ">
                                <h1 style="text-align: center; margin-bottom: 20px;">${title}</h1>
                                <div id="minerTableDiv"; style="flex: 1; width: 100%; max-height: 80%; overflow-y: auto; scrollbar-width: thin; scrollbar-color: #555 #333;">
                                    <table id="minerTable"; style="width: 100%; color: white;" class="display responsive nowrap">
                                        <thead>
                                            <tr>
                                                ${cols.map(col => `<th style="border: 2px solid gray; padding: 10px;">${col}</th>`).join('')}
                                            </tr>
                                        </thead>
                                        <tbody>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        `;

                        // Ensure this popup is on top of everything
                        popupResultElement.style.zIndex = '9999';

                        // Set an ID on popupResultElement
                        popupResultElement.id = 'popupResultElement';

                        // Add additional styling for the table using CSS
                        const tableStyle = document.createElement('style');
                        tableStyle.textContent = `
                            #minerTable {
                                border-collapse: collapse;
                                margin-top: 20px;
                            }

                            #minerTable th,
                            #minerTable td {
                                border: 1px solid gray;
                                padding: 10px;
                            }

                            #minerTable th {
                                background-color: #444;
                                color: white;
                            }

                            #minerTable td {
                                text-align: center;
                                transition: background-color 0.2s ease;
                            }

                            #minerTable tr:hover td {
                                background-color: #555;
                            }

                            #minerTable th:hover {
                                cursor: pointer; /* indicates that the column can be reordered */
                            }

                            // When hovering between columns, show the resize cursor
                            #minerTable th.ui-resizable-column:hover {
                                cursor: col-resize;
                            }
                        `;
                        document.head.appendChild(tableStyle);

                        // Append popup to the body first, then assign the event listeners
                        if (parent) {
                            parent.appendChild(popupResultElement);

                            
                            // Resize and align into the parent
                            popupResultElement.style.width = '100%';
                            popupResultElement.style.height = '100%';
                            popupResultElement.style.maxWidth = '100%';
                            popupResultElement.style.maxHeight = '100%';
                            popupResultElement.style.position = 'relative';

                            // Make sure it cant expand beyond the parent
                            popupResultElement.style.overflow = 'hidden';
                            
                        } else {
                            document.body.appendChild(popupResultElement);
                        }

                        if (callback) {
                            callback(popupResultElement);
                        }
                    }

                    function formatUptime(uptime) {
                        var minutes = Math.floor(uptime % (60*60) / 60);
                        var seconds = Math.floor(uptime % 60);

                        return `${minutes}m ${seconds}s`;
                    }

                    function createScanOverlayUI() {
                        // Create an element to completely cover the page
                        var scanningElement = document.createElement('div');
                        scanningElement.style.position = 'fixed';
                        scanningElement.style.top = '0';
                        scanningElement.style.left = '0';
                        scanningElement.style.width = '100%';
                        scanningElement.style.height = '100%';
                        scanningElement.style.backgroundColor = 'rgba(10, 10, 10, 1)';
                        scanningElement.style.color = 'white';
                        scanningElement.style.display = 'flex';
                        scanningElement.style.flexDirection = 'column'; // Added line
                        scanningElement.style.justifyContent = 'center';
                        scanningElement.style.alignItems = 'center';
                        scanningElement.style.fontSize = '2em';
                        scanningElement.style.zIndex = '9998'; // Set the zIndex to be above everything
                        document.body.appendChild(scanningElement);

                        const progressBar = document.createElement('div');
                        progressBar.style.width = '50%';
                        progressBar.style.height = '20px';
                        progressBar.style.backgroundColor = 'gray';
                        progressBar.style.marginTop = '10px';
                        progressBar.style.border = '4px solid black';
                        scanningElement.appendChild(progressBar);

                        var progressFill = document.createElement('div');
                        progressFill.style.width = '0%';
                        progressFill.style.height = '100%';
                        progressFill.style.backgroundColor = 'green';
                        progressFill.style.borderRight = '1px solid black'; // Modify border style
                        progressBar.appendChild(progressFill);

                        // Add Scanning text below the progress bar
                        var scanningText = document.createElement('div');
                        scanningText.textContent = 'Getting Miner Data...';
                        scanningText.style.marginTop = '10px';
                        scanningText.style.textAlign = 'left';
                        scanningElement.appendChild(scanningText);

                        // Add percentage text to top left of the screen
                        var percentageText = document.createElement('div');
                        percentageText.textContent = '';
                        percentageText.style.position = 'absolute';
                        percentageText.style.left = '10px';
                        percentageText.style.top = '10px';
                        percentageText.style.color = 'white';
                        percentageText.style.fontSize = '1em';
                        scanningElement.appendChild(percentageText);

                        // Add the progress log on the right side of the screen
                        var progressLog = document.createElement('div');
                        progressLog.style.position = 'fixed';
                        progressLog.style.top = '0';
                        progressLog.style.right = '0';
                        progressLog.style.width = '300px';
                        progressLog.style.height = '100%';
                        progressLog.style.backgroundColor = 'rgba(10, 10, 10, 1)';
                        progressLog.style.color = 'white';
                        progressLog.style.fontSize = '1em';
                        progressLog.style.zIndex = '9998'; // Set the zIndex to be above everything
                        progressLog.style.overflow = 'auto';
                        document.body.appendChild(progressLog);

                        // Spin rotation to be used in the loading icon
                        let rotation = 0;

                        // Add a message to the progress log
                        const logMessage = document.createElement('div');
                        logMessage.textContent = 'Progress Log';
                        logMessage.style.padding = '10px';
                        logMessage.style.borderTop = '1px solid white';
                        progressLog.appendChild(logMessage);
                        var logEntries = {};

                        function setPreviousLogDone(currentMinerId, symbol, additionalText) {
                            let logEntry = logEntries[currentMinerId];
                            if (!logEntry) { return; }

                            const wasScrollAtBottom = progressLog.scrollTop + progressLog.clientHeight >= progressLog.scrollHeight-10;

                            symbol = symbol || '✓';

                            // Make it a checkmark
                            const checkmark = document.createElement('span');
                            checkmark.textContent = symbol;
                            checkmark.style.display = 'inline-block';
                            checkmark.style.position = 'absolute';
                            checkmark.style.right = '10px';

                            // Remove the spinning 'loading' icon from the log entry
                            const loadingIcon = logEntry.querySelector('span');
                            if (loadingIcon) {
                                // Add the checkmark right before the loading icon
                                logEntry.insertBefore(checkmark, loadingIcon);

                                // Stop the spinning
                                clearInterval(loadingIcon.loadingIconInterval);
                                loadingIcon.remove();
                            }

                            if (additionalText) {
                                logEntry.appendChild(document.createElement('br'));
                                const additionalTextNode = document.createTextNode(additionalText);
                                const additionalTextLines = additionalText.split('\n');
                                additionalTextLines.forEach((line, index) => {
                                    logEntry.appendChild(document.createTextNode(line));
                                    if (index < additionalTextLines.length - 1) {
                                        logEntry.appendChild(document.createElement('br'));
                                    }
                                });
                            }

                            // Scroll to the bottom of the progress log
                            if (wasScrollAtBottom) {
                                progressLog.scrollTop = progressLog.scrollHeight;
                            }
                        }

                        function addToProgressLog(currentMiner) {
                            const wasScrollAtBottom = progressLog.scrollTop + progressLog.clientHeight >= progressLog.scrollHeight-10;
                            
                            // Add to progress log
                            const logEntry = document.createElement('div');
                            const logLink = document.createElement('a');
                            const minerID = currentMiner.id;
                            const minerLink = `https://foundryoptifleet.com/Content/Miners/IndividualMiner?id=${minerID}`;
                            const minerModel = currentMiner.modelName;
                            logLink.textContent = `Miner ${minerModel}`;
                            logLink.href = minerLink; // Make it clickable
                            logLink.target = '_blank'; // Open in a new tab
                            logLink.style.color = 'inherit'; // To keep the link color same as text color
                            //logLink.style.textDecoration = 'none'; // To remove underline from the link

                            logEntry.style.borderTop = '1px solid white';
                            logEntry.style.padding = '10px';
                            logEntry.appendChild(logLink);

                            logEntries[minerID] = logEntry;
                            progressLog.appendChild(logEntry);

                            // Add spinning 'loading' icon into the log entry, such as that it shows up as far right as possible
                            const loadingIcon = document.createElement('span');
                            loadingIcon.textContent = '↻';
                            loadingIcon.style.display = 'none';
                            loadingIcon.style.position = 'absolute';
                            loadingIcon.style.right = '10px';
                            logEntry.appendChild(loadingIcon);

                            // Make it spin
                            loadingIcon.loadingIconInterval = setInterval(() => {
                                rotation = (rotation + 0.5) % 360;
                                loadingIcon.style.transform = `rotate(${rotation}deg)`;
                            }, 1);
                            loadingIcon.style.display = 'inline-block';  // Show the icon

                            // Add location to the log entry
                            const minerSlotID = currentMiner.locationName;
                            const locationLog = document.createElement('div');
                            locationLog.textContent = `${minerSlotID}`;
                            locationLog.style.padding = '10px';
                            locationLog.style.paddingTop = '0';
                            locationLog.style.paddingLeft = '0px';
                            logEntry.appendChild(locationLog);

                            // Scroll to the bottom of the progress log
                            if (wasScrollAtBottom) {
                                progressLog.scrollTop = progressLog.scrollHeight;
                            }
                        }

                        return [scanningElement, progressBar, progressFill, scanningText, percentageText, progressLog, logEntries, addToProgressLog, setPreviousLogDone];
                    }

                    var orginalTitle = document.title;
                    function startScan(timeFrame, autoreboot, rebootAllMiners) {
                        var rebootData = {};

                        // Get saved last reboot times
                        var lastRebootTimes = GM_SuperValue.get('lastRebootTimes', {});
                        var reachedScanEnd = false;

                        function getTotalRebootCount() {
                            var rebootCount = 0;
                            var earliestTime = new Date();
                            var timeLeft = '';
                            for (const [minerID, rebootData] of Object.entries(lastRebootTimes)) {
                                var softRebootTimes = rebootData.softRebootsTimes || [];
                                var lastSoftRebootTime = softRebootTimes[softRebootTimes.length-1] || false;
                                var timeSinceLastSoftReboot = lastSoftRebootTime ? (new Date() - new Date(lastSoftRebootTime)) : false;
                                if(timeSinceLastSoftReboot && timeSinceLastSoftReboot < 15*60*1000) {
                                    rebootCount++;
                                    if(new Date(lastSoftRebootTime) <= earliestTime) {
                                        earliestTime = new Date(lastSoftRebootTime);
                                        const timeToReset = new Date(earliestTime.getTime() + 15*60*1000);
                                        timeLeft = Math.floor((timeToReset - new Date()) / 1000);
                                        const minutes = Math.floor(timeLeft / 60);
                                        const seconds = timeLeft % 60;
                                        timeLeft = ` | ${minutes}m ${seconds}s`;
                                    }
                                }
                            }
                            return [rebootCount, timeLeft];
                        }

                        // Close the dropdown
                        issues.toggleDropdownMenu('newActionsDropdown');

                        let [scanningElement, progressBar, progressFill, scanningText, percentageText, progressLog, logEntries, addToProgressLog, setPreviousLogDone] = createScanOverlayUI();

                        // Set the webpage title
                        document.title = orginalTitle + ' | Retrieving Miner Data...';
                        retrieveContainerTempData((containerTempData) => {
                            function rebootLogic(rebootMiners) {
                                var minersScanData = {};
                                var maxRebootAllowed = 100;

                                // Animate the dots cycling
                                let dots = 0;
                                var scanningInterval = setInterval(() => {
                                    dots = (dots + 1) % 4;
                                    scanningText.textContent = 'Scanning' + '.'.repeat(dots);
                                }, 500);

                                //var currentMiner = rebootMiners[0];
                                var currentMinerIndex = 0;
                                var updatePercentageTextInteval = setInterval(() => {
                                    // Calculate the progress percentage
                                    var totalMiners = rebootMiners.length;
                                    var minersScanned = currentMinerIndex;
                                    const progressPercentage = (minersScanned / totalMiners) * 100;

                                    // Update the progress bar fill and percentage text
                                    progressFill.style.width = progressPercentage + '%';
                                    percentageText.textContent = Math.floor(progressPercentage) + '% (' + minersScanned + '/' + totalMiners + ')';

                                    // Update the title
                                    document.title = orginalTitle + ' | ' + percentageText.textContent;

                                    if (reachedScanEnd) {
                                        clearInterval(updatePercentageTextInteval);
                                    }
                                }, 50);

                                // Loop through allMinersData and get the uptime
                                var firstScan = true;
                                let stackDepth = 0;
                                const maxStackDepth = 65;
                                function parseMinerUpTimeData(currentMiner, timeFrame, callback) {
                                    stackDepth++;

                                    if(stackDepth >= maxStackDepth) {
                                        stackDepth = 0;
                                        setTimeout(() => { // Time out to try and fix max call stack error
                                            parseMinerUpTimeData(currentMiner, timeFrame, callback);
                                        }, 0);
                                        return
                                    }

                                    let minerID = currentMiner.id;

                                    addToProgressLog(currentMiner);

                                    function checkMiner(minerID) {
                                        var location = currentMiner.locationName;
                                        rebootData[currentMiner.id] = rebootData[currentMiner.id] || {};
                                        rebootData[currentMiner.id].miner = currentMiner;
                                        if(!location || location === "Unassigned") {
                                            //console.error("No location for miner: " + minerID);
                                            rebootData[currentMiner.id] = rebootData[currentMiner.id] || {};
                                            rebootData[currentMiner.id].details = {};
                                            rebootData[currentMiner.id].details.main = "Missing Location";
                                            rebootData[currentMiner.id].details.sub = [];
                                            rebootData[currentMiner.id].details.sub.push("Miner is unassigned.");
                                            rebootData[currentMiner.id].details.color = 'red';
                                            return;
                                        }

                                        // Check if the miner is in the frozen list
                                        if(frozenMiners.includes(minerID)) { // remove 411660 later
                                            rebootData[currentMiner.id] = rebootData[currentMiner.id] || {};
                                            rebootData[currentMiner.id].details = {};
                                            rebootData[currentMiner.id].details.main = "Frozen Miner";
                                            rebootData[currentMiner.id].details.sub = [];
                                            rebootData[currentMiner.id].details.sub.push("Miner is frozen.");
                                            rebootData[currentMiner.id].details.color = 'red';
                                            return;
                                        }

                                        const min15 = 15*60;
                                        const minSoftRebootUpTime = 60*60; // 1 hour
                                        const upTime = currentMiner.uptimeValue;
                                        const container = location.split("_")[1].split("-")[0].replace(/\D/g, '').replace(/^0+/, '');
                                        const maxTemp = 78;
                                        const containerTemp = containerTempData[container].temp;
                                        const powerMode = currentMiner.powerModeName;
                                        let hashRateEfficiency = currentMiner.hashRatePercent;
                                        if(!rebootAllMiners) {
                                            hashRateEfficiency = false;
                                        }

                                        const isOnline = currentMiner.statusName === 'Online';
                                        let moreThanOneHour = upTime > minSoftRebootUpTime;
                                        const belowMaxTemp = containerTemp <= maxTemp;

                                        const minerRebootTimesData = lastRebootTimes[minerID] || {};
                                        const softRebootTimes = minerRebootTimesData.softRebootsTimes || [];
                                        const lastSoftRebootTime = softRebootTimes[softRebootTimes.length-1] || false;
                                        const timeSinceLastSoftReboot = lastSoftRebootTime ? (new Date() - new Date(lastSoftRebootTime)) : false;
                                        
                                        if(timeSinceLastSoftReboot && timeSinceLastSoftReboot < 60*60*1000) { // Mainly if the page was reloaded or something and another scan was started before the miner uptime data could change so it still thinks it hasn't been rebooted IE the uptime hasn't changed
                                            moreThanOneHour = false;
                                        }

                                        rebootData[minerID] = rebootData[minerID] || {};
                                        rebootData[minerID].belowMaxTemp = belowMaxTemp;
                                        rebootData[minerID].moreThanOneHour = moreThanOneHour;
                                        rebootData[minerID].isOnline = isOnline;
                                        rebootData[minerID].details = [];
                                        rebootData[minerID].miner = currentMiner;

                                        
                                        lastRebootTimes[minerID] = lastRebootTimes[minerID] || {};
                                        const manualHardReboot = lastRebootTimes[minerID].manualHardReboot || false;
                                        const hardRebootAttemptedTime = lastRebootTimes[minerID].hardRebootAttempted || false;

                                        // If the miner has a lastRebootTime and it is at or more than 15 minutes and still has a 0 hash rate, then we can flag it to be hard rebooted, or if the miner last uptime is the same as the current uptime
                                        const minTime = 15*60*1000; // 15 minutes
                                        const forgetTime = 60*60*1000; // 1 hours

                                        const isPastMinTime = timeSinceLastSoftReboot >= minTime;
                                        const notPastForgetTime = timeSinceLastSoftReboot < forgetTime;

                                        // Loops through the softRebootsTimes and remove any that are more than 12 hours old
                                        lastRebootTimes[minerID] = lastRebootTimes[minerID] || {};
                                        lastRebootTimes[minerID].softRebootsTimes = lastRebootTimes[minerID].softRebootsTimes || [];
                                        lastRebootTimes[minerID].softRebootsTimes = lastRebootTimes[minerID].softRebootsTimes.filter((time) => {
                                            return (new Date() - new Date(time)) < 12*60*60*1000;
                                        });

                                        const numOfSoftReboots = lastRebootTimes[minerID].softRebootsTimes.length;
                                        const moreThan3SoftReboots = numOfSoftReboots >= 3;

                                        
                                        const timeSinceHardRebootAttempted = hardRebootAttemptedTime ? (new Date() - new Date(hardRebootAttemptedTime)) : false;
                                        const hardRebootAttempted = (timeSinceHardRebootAttempted && timeSinceHardRebootAttempted < 6*60*60*1000) || hardRebootAttemptedTime === true;

                                        let hardRebootRecommended = lastRebootTimes[minerID].hardRebootRecommended || false;
                                        const timeSinceHardRebootRecommended = hardRebootRecommended ? (new Date() - new Date(hardRebootRecommended)) : false;
                                        hardRebootRecommended = timeSinceHardRebootRecommended && timeSinceHardRebootRecommended < 12*60*60*1000; // 12 hours
                                        let hardRebootRecommendedBool = !hardRebootAttempted && ((isPastMinTime && notPastForgetTime) || moreThan3SoftReboots || !isOnline || manualHardReboot);

                                        if(isOnline && !hardRebootRecommendedBool && !hardRebootAttempted) {
                                            if(moreThanOneHour && belowMaxTemp && (!hashRateEfficiency || hashRateEfficiency > 0)) { // If the miner passed the conditions, then we can reboot it

                                                // Loop through lastRebootTimes, and get the last reboot time for each miner, if it has been less than 15 minutes, we will count that as activly rebooting
                                                var rebootCount = getTotalRebootCount()[0];

                                                if(rebootCount < maxRebootAllowed) {
                                                    // Reboot the miner
                                                    const minerIdList = [minerID];
                                                    
                                                    rebootData[minerID].details.main = "Sent Soft Reboot";
                                                    rebootData[minerID].details.sub = [
                                                        "Miner has been online for more than 1 hour.",
                                                        "Miner is below 78°F."
                                                    ];
                                                    
                                                    const formattedTime = new Date(new Date().toISOString()).toLocaleTimeString();
                                                    rebootData[minerID].details.sub.push("Soft Reboot sent at: " + formattedTime);
                                                    rebootData[minerID].details.sub.push("Soft Reboot ends at: " + new Date(new Date(new Date().toISOString()).getTime() + min15*1000).toLocaleTimeString());

                                                    // Update the lastRebootTimes
                                                    lastRebootTimes[minerID].upTimeAtReboot = upTime;
                                                    lastRebootTimes[minerID].softRebootsTimes = lastRebootTimes[minerID].softRebootsTimes || [];
                                                    lastRebootTimes[minerID].softRebootsTimes.push(new Date().toISOString());

                                                    // Actually send the reboot request
                                                    serviceInstance.post(`/RebootMiners`, { miners: minerIdList, bypassed: false })
                                                        .then(() => {
                                                            console.log("Rebooted Miner: " + minerID);
                                                        })
                                                        .catch((error) => {
                                                            console.error("Failed to reboot Miner: " + minerID, error);
                                                            
                                                            // Remove the last reboot time if the reboot failed
                                                            //lastRebootTimes[minerID].softRebootsTimes.pop();

                                                            // Save the last reboot times
                                                            //GM_SuperValue.set('lastRebootTimes', lastRebootTimes);
                                                        });
                                                } else {
                                                    rebootData[minerID].details.main = "Max Reboot Limit Reached";
                                                    rebootData[minerID].details.sub = [
                                                        "Miner has been online for more than 1 hour.",
                                                        "Miner is below 78°F.",
                                                        "Max Reboot Limit of " + maxRebootAllowed + " reached.",
                                                        "15 minutes needs to pass before another reboot can be sent."
                                                    ];
                                                }
                                            } else {
                                                if(timeSinceLastSoftReboot && timeSinceLastSoftReboot <= min15*1000) {
                                                    rebootData[minerID].details.main = "Waiting on Soft Reboot Result";
                                                    rebootData[minerID].details.sub = [];
                                                    rebootData[minerID].details.color = 'yellow';
                                                    const formattedTime = new Date(lastSoftRebootTime).toLocaleTimeString();
                                                    rebootData[minerID].details.sub.push("Soft Reboot sent at: " + formattedTime);
                                                    rebootData[minerID].details.sub.push("Soft Reboot ends at: " + new Date(new Date(lastSoftRebootTime).getTime() + min15*1000).toLocaleTimeString());
                                                    const timeLeft = (min15*1000 - timeSinceLastSoftReboot)/1000;
                                                    rebootData[minerID].details.sub.push("Time Left: " + formatUptime(timeLeft));
                                                } else {
                                                    rebootData[minerID].details.main = "Soft Reboot Skipped";
                                                    rebootData[minerID].details.sub = [];
                                                    if(!moreThanOneHour) {
                                                        rebootData[minerID].details.sub.push("Miner has an uptime less than 1 hour.");
                                                        rebootData[minerID].details.sub.push("Current Uptime: " + formatUptime(upTime));
                                                    }
                                                }
                                            }

                                            if(powerMode === "Low Power") {
                                                rebootData[minerID].details.sub.push("Miner is in Low Power Mode.");
                                            }
                                        }

                                        // Check if the miner is at 0 uptime and is online, if so that might indicate it is stuck, but we only do it if the normal soft reboot conditions have gone through and is now skipping
                                        const stuckAtZero = upTime === 0 && isOnline && rebootData[minerID].details.main === "Soft Reboot Skipped";
                                        if(stuckAtZero) {
                                            rebootData[minerID].details.sub.push("Miner might be stuck at 0 uptime? Please wait for confirmation check...");
                                        }
                                        
                                        if( hardRebootRecommendedBool ) {
                                            lastRebootTimes[minerID] = lastRebootTimes[minerID] || {};

                                            rebootData[minerID].details.main = "Hard Reboot Recommended";
                                            rebootData[minerID].details.sub = [];
                                            rebootData[minerID].details.color = 'orange';

                                            if(manualHardReboot) {
                                                rebootData[minerID].details.sub.push("Manually set should hard reboot.");
                                            }

                                            if(isPastMinTime && notPastForgetTime) {
                                                rebootData[minerID].details.sub.push("15 Minutes has passed since last soft reboot and miner is still not hashing.");
                                            }

                                            if(moreThan3SoftReboots) {
                                                rebootData[minerID].details.sub.push(`${numOfSoftReboots} Soft Reboots sent from this computer in the last 12 hours`);
                                            }

                                            if(!isOnline) {
                                                rebootData[minerID].details.sub.push("Miner is offline.");
                                            }

                                            // Save that a hard reboot was recommended
                                            lastRebootTimes[minerID].hardRebootRecommended = new Date().toISOString();
                                        } else if(hardRebootAttempted) {

                                            if(timeSinceHardRebootAttempted >= min15*1000 || hardRebootAttemptedTime === true) {
                                                rebootData[minerID].details.main = "Pull Recommended";
                                                rebootData[minerID].details.sub = [];
                                                if(hardRebootAttemptedTime === true) {
                                                    rebootData[minerID].details.sub.push("Manually set should pull.");
                                                } else {
                                                    rebootData[minerID].details.sub.push("15 Minutes has passed since hard reboot attempt.");
                                                }
                                                rebootData[minerID].details.color = 'red';
                                            } else {
                                                rebootData[minerID].details.main = "Waiting on Hard Reboot Result";
                                                rebootData[minerID].details.sub = [];
                                                rebootData[minerID].details.color = 'yellow';
                                                const formattedTime = new Date(hardRebootAttemptedTime).toLocaleTimeString();
                                                rebootData[minerID].details.sub.push("15 Minutes has not passed since hard reboot mark time.");
                                                rebootData[minerID].details.sub.push("Hard Reboot Marked at: " + formattedTime);
                                                const timeSinceSent = new Date() - new Date(hardRebootAttemptedTime);
                                                const timeLeft = (min15*1000 - timeSinceSent)/1000;
                                                rebootData[minerID].details.sub.push("Time Left: " + formatUptime(timeLeft));
                                            }

                                            if(!isOnline) {
                                                rebootData[minerID].details.sub.push("Miner is offline.");
                                            } else if(stuckAtZero) {
                                                rebootData[minerID].details.sub.push("Miner is stuck at 0 uptime.");
                                            }
                                        }

                                        if(powerMode === "Sleep") {
                                            rebootData[minerID].details.main = "Sleep Mode";
                                            rebootData[minerID].details.sub.push("Miner is in Sleep Mode.");
                                        }

                                        if(!belowMaxTemp) {
                                            rebootData[minerID].details.main = "Container Over Temp";
                                            rebootData[minerID].details.sub.push("Container is above 78°F.");
                                        }

                                        if(hashRateEfficiency) {
                                            rebootData[minerID].details.sub.push("Hash Rate Efficiency: " + (hashRateEfficiency*100).toFixed(1));
                                        }

                                        lastRebootTimes[minerID].previousUpTime = upTime;
                                    }

                                    function runNextMiner() {
                                        setPreviousLogDone(currentMiner.id);

                                        // Add if it sent reboot or skipped
                                        if(autoreboot) {
                                            var curRebootData = rebootData[currentMiner.id] || {};
                                            function addExtraDetailToLog() {
                                                let details = curRebootData.details || {};
                                                const logEntry = document.createElement('div');
                                                logEntry.textContent = `[${details.main}]`;
                                                logEntry.style.padding = '10px';
                                                logEntry.style.paddingTop = '0';
                                                logEntry.style.paddingLeft = '20px';
                                                progressLog.appendChild(logEntry);

                                                // Add sub details
                                                var subDetails = details.sub || [];
                                                subDetails.forEach(subDetail => {
                                                    const subLogEntry = document.createElement('div');
                                                    subLogEntry.textContent = "• " + subDetail;
                                                    subLogEntry.style.padding = '10px';
                                                    subLogEntry.style.paddingTop = '0';
                                                    subLogEntry.style.paddingLeft = '40px';
                                                    progressLog.appendChild(subLogEntry);
                                                });
                                            }

                                            addExtraDetailToLog();
                                        }

                                        // Run the next miner
                                        if(firstScan) {
                                            currentMinerIndex++;
                                            if (currentMinerIndex < Object.keys(rebootMiners).length) {
                                                currentMiner = rebootMiners[currentMinerIndex];
                                                parseMinerUpTimeData(currentMiner, timeFrame);
                                            }
                                        }

                                        // If we are done with all the miners, then add a log entry
                                        if(reachedScanEnd) {
                                            console.log("Reached the end of the scan");
                                            return;
                                        }

                                        if (currentMinerIndex === Object.keys(rebootMiners).length) {
                                            reachedScanEnd = true;
                                            
                                            // Save the rebootData
                                            GM_SuperValue.set('lastRebootTimes', lastRebootTimes);

                                            // Stop the scanning interval
                                            clearInterval(scanningInterval);

                                            if(autoreboot && firstScan) {
                                                firstScan = false;

                                                // Create table for the miners that should be hard rebooted
                                                const cols = ['IP', 'Miner', 'Slot ID & Breaker', 'Serial Number', "Scan Result"];
                                                createPopUpTable(`Auto Reboot System`, cols, false, (popupResultElement) => {

                                                    const firstDiv = popupResultElement.querySelector('div');
                                                    // Create a container for the refresh text and button
                                                    const refreshContainer = document.createElement('div');
                                                    refreshContainer.style.position = 'absolute';
                                                    refreshContainer.style.right = '30px';
                                                    refreshContainer.style.top = '30px';
                                                    refreshContainer.style.display = 'flex';
                                                    refreshContainer.style.alignItems = 'center';
                                                    firstDiv.appendChild(refreshContainer);

                                                    // Add a "Refreshing in (60s)" text
                                                    let countdown = 60;
                                                    if(rebootAllMiners) {
                                                        countdown = 60*15;
                                                    }
                                                    const refreshText = document.createElement('div');
                                                    refreshText.textContent = `Refreshing in (${countdown}s)`;
                                                    refreshText.style.color = 'white';
                                                    refreshText.style.fontSize = '1em';
                                                    refreshText.style.backgroundColor = '#444947';
                                                    refreshText.style.borderRadius = '10px'; // Rounded corners
                                                    refreshText.style.padding = '5px 10px';
                                                    refreshContainer.appendChild(refreshText);

                                                    // Add a "pause" button
                                                    const pauseButton = document.createElement('button');
                                                    pauseButton.className = 'm-button is-ghost is-icon-only';
                                                    pauseButton.type = 'button';
                                                    pauseButton.id = 'pauseAutoReboot';
                                                    pauseButton.style.cssText = `
                                                        margin-left: 10px; /* Add some space between the text and the button */
                                                        background-color: #0078d4;
                                                        color: white;
                                                        display: inline-block; /* Ensure the button is displayed inline with the text */
                                                        display: flex; /* Use flexbox to center the icon */
                                                        align-items: center; /* Vertically center the icon */
                                                        justify-content: center; /* Horizontally center the icon */
                                                    `;

                                                    const pauseIcon = document.createElement('img');
                                                    const pauseIconURL = 'https://img.icons8.com/?size=100&id=61012&format=png&color=FFFFFF';
                                                    const playIconURL = 'https://img.icons8.com/?size=100&id=59862&format=png&color=FFFFFF';
                                                    pauseIcon.src = pauseIconURL;
                                                    pauseIcon.alt = 'Pause Icon';
                                                    pauseIcon.style.cssText = `
                                                        width: var(--size-icon-xl);
                                                        height: var(--size-icon-xl);
                                                    `;

                                                    refreshContainer.appendChild(pauseButton);
                                                    pauseButton.appendChild(pauseIcon);

                                                    // Toggle pause icon on click
                                                    var pauseTime = false;
                                                    var targetTime = Date.now() + countdown * 1000;
                                                    pauseButton.addEventListener('click', () => {
                                                        if (pauseIcon.src === pauseIconURL) {
                                                            pauseIcon.src = playIconURL;
                                                            pauseTime = targetTime - Date.now()
                                                        } else {
                                                            pauseIcon.src = pauseIconURL;
                                                            targetTime = Date.now() + pauseTime;
                                                            pauseTime = false;
                                                        }
                                                    });

                                                    // Add a "Refresh" button
                                                    const refreshButton = document.createElement('button');
                                                    refreshButton.className = 'm-button is-ghost is-icon-only';
                                                    refreshButton.type = 'button';
                                                    refreshButton.id = 'refreshAutoReboot';
                                                    refreshButton.style.cssText = `
                                                        margin-left: 10px; /* Add some space between the text and the button */
                                                        background-color: #0078d4;
                                                        color: white;
                                                        display: inline-block; /* Ensure the button is displayed inline with the text */
                                                    `;

                                                    const refreshIcon = document.createElement('m-icon');
                                                    refreshIcon.size = 'xl';
                                                    refreshIcon.name = 'refresh-cw';
                                                    refreshIcon.className = 'refresh-icon';
                                                    refreshIcon.style.cssText = `
                                                        width: var(--size-icon-xl);
                                                        height: var(--size-icon-xl);
                                                    `;

                                                    refreshContainer.appendChild(refreshButton);
                                                    refreshButton.appendChild(refreshIcon);

                                                    // Now the button is created, we can grab the actual button element
                                                    const refreshAutoRebootButton = popupResultElement.querySelector('#refreshAutoReboot');

                                                    
                                                    // Update the countdown
                                                    const countdownInterval = setInterval(() => {
                                                        if (pauseTime) {
                                                            return;
                                                        }
                                                        if (!targetTime) return;
                                                        const remainingTime = Math.max(0, Math.floor((targetTime - Date.now()) / 1000));
                                                        refreshText.textContent = `Refreshing in (${remainingTime}s)`;
                                                        if (remainingTime <= 0) {
                                                            refreshAutoRebootButton.click();
                                                        }
                                                    }, 500);

                                                    // Add button hover effect
                                                    refreshAutoRebootButton.addEventListener('mouseenter', function() {
                                                        this.style.backgroundColor = '#106ebe';
                                                    });

                                                    refreshAutoRebootButton.addEventListener('mouseleave', function() {
                                                        this.style.backgroundColor = '#0078d4';
                                                    });

                                                    function setUpRowData(row, currentMiner) {
                                                        currentMiner = currentMiner || {};
                                                        let minerID = currentMiner.id || "Missing ID";
                                                        let minerRebootData = rebootData[minerID] || {};
                                                        let model = currentMiner.modelName || "Missing Model";
                                                        let slotID = currentMiner.locationName || "Missing Slot ID";

                                                        var splitSlotID = slotID.split('-');
                                                        var containerID = splitSlotID[0].split('_')[1];
                                                        var rackNum = Number(splitSlotID[1]);
                                                        var rowNum = Number(splitSlotID[2]);
                                                        var colNum = Number(splitSlotID[3]);
                                                        var rowWidth = 4;
                                                        var breakerNum = (rowNum-1)*rowWidth + colNum;
                
                                                        // Remakes the slot ID, but with added 0 padding
                                                        let reconstructedSlotID = `${containerID}-${rackNum.toString().padStart(2, '0')}-${rowNum.toString().padStart(2, '0')}-${colNum.toString().padStart(2, '0')}`;

                                                        // Adds together the slot ID and breaker number, where the breaker number is padded with spaces
                                                        let paddedSlotIDBreaker = `${reconstructedSlotID}  [${breakerNum.toString().padStart(2, '0')}]`;

                                                        let minerSerialNumber = currentMiner.serialNumber;
                                                        minerRebootData.details = minerRebootData.details || {};
                                                        minerRebootData.details.main = minerRebootData.details.main || "ERROR";
                                                        minerRebootData.details.sub = minerRebootData.details.sub || ["Failed to get details!"];
                                                        
                                                        let minerLink = `https://foundryoptifleet.com/Content/Miners/IndividualMiner?id=${minerID}`;
                                                        row.innerHTML = `
                                                            <td style="text-align: left; position: relative;">
                                                                <a href="http://${currentMiner.username}:${currentMiner.passwd}@${currentMiner.ipAddress}/" target="_blank" style="color: white;">${currentMiner.ipAddress}</a>
                                                            </td>
                                                            <td style="text-align: left; position: relative;">
                                                                <a href="${minerLink}" target="_blank" style="color: white;">${model}</a>
                                                            </td>
                                                            <td style="text-align: left;">${paddedSlotIDBreaker}</td>
                                                            <td style="text-align: left;">${minerSerialNumber}</td>
                                                            <td style="text-align: left; position: relative;">
                                                                ${minerRebootData.details.main}
                                                                <div style="display: inline-block; margin-left: 5px; cursor: pointer; position: relative; float: right;">
                                                                    <div style="width: 20px; height: 20px; border-radius: 50%; background-color: #0078d4; color: white; text-align: center; line-height: 20px; font-size: 12px; border: 1px solid black; font-weight: bold; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;">?</div>
                                                                    <div style="display: none; position: absolute; top: 20px; right: 0; background-color: #444947; color: white; padding: 5px; border-radius: 5px; z-index: 9999; white-space: nowrap; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);">
                                                                        [${minerRebootData.details.main}]
                                                                        ${minerRebootData.details.sub.map(subDetail => `<div style="padding-left: 10px; padding-top: 6px;">• ${subDetail}</div>`).join('')}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        `;

                                                        var questionColor = minerRebootData.details.color || false;
                                                        if(questionColor) {
                                                            row.querySelector('td:last-child div[style*="position: relative;"] div').style.backgroundColor = questionColor;   
                                                        }

                                                        row.minerID = minerID;
                                                        row.minerDataCopy = structuredClone(currentMiner);

                                                        // Add a button before the question mark that says Did Hard Reboot if details.main === "Hard Reboot Recommended"
                                                        if(minerRebootData.details.main === "Hard Reboot Recommended") {
                                                            const hardRebootButton = document.createElement('button');
                                                            hardRebootButton.textContent = 'Mark Hard Rebooted';
                                                            hardRebootButton.style.cssText = `
                                                                background-color: #0078d4;
                                                                color: white;
                                                                border: none;
                                                                cursor: pointer;
                                                                border-radius: 5px;
                                                                transition: background-color 0.3s;
                                                                margin-left: 5px;
                                                            `;
                                                            row.querySelector('td:last-child').appendChild(hardRebootButton);

                                                            // Add button hover effect
                                                            hardRebootButton.addEventListener('mouseenter', function() {
                                                                this.style.backgroundColor = '#005a9e';
                                                            });

                                                            hardRebootButton.addEventListener('mouseleave', function() {
                                                                this.style.backgroundColor = '#0078d4';
                                                            });

                                                            // Add click event to the button
                                                            hardRebootButton.onclick = function() {
                                                                lastRebootTimes[minerID].hardRebootAttempted = new Date().toISOString();
                                                                lastRebootTimes[minerID].hardRebootRecommended = false;
                                                                lastRebootTimes[minerID].manualHardReboot = false;

                                                                // make a copy of the details data
                                                                lastRebootTimes[minerID].previousDetails = structuredClone(rebootData[minerID].details);

                                                                // Save lastRebootTimes
                                                                GM_SuperValue.set('lastRebootTimes', lastRebootTimes);

                                                                // Set the details to show that it is hard rebooting
                                                                rebootData[minerID].details.main = "Waiting on Hard Reboot Result";
                                                                rebootData[minerID].details.sub = ["15 Minutes has not passed since hard reboot mark time."];

                                                                setUpRowData(row, currentMiner);
                                                            }
                                                        }
                                                        
                                                        // Add a button to cancel the hard reboot mark if details.main === "Waiting on Hard Reboot Result"
                                                        if(minerRebootData.details.main === "Waiting on Hard Reboot Result") {
                                                            const cancelButton = document.createElement('button');
                                                            cancelButton.textContent = 'Unmark Hard Reboot';
                                                            cancelButton.style.cssText = `
                                                                background-color: #dc3545; /* Red background */
                                                                color: white;
                                                                border: none;
                                                                cursor: pointer;
                                                                border-radius: 5px;
                                                                transition: background-color 0.3s;
                                                                margin-left: 5px;
                                                            `;
                                                            row.querySelector('td:last-child').appendChild(cancelButton);
                                                            
                                                            // Add button hover effect
                                                            cancelButton.addEventListener('mouseenter', function() {
                                                                this.style.backgroundColor = '#c82333'; /* Darker red on hover */
                                                            });

                                                            cancelButton.addEventListener('mouseleave', function() {
                                                                this.style.backgroundColor = '#dc3545'; /* Original red */
                                                            });

                                                            // Add click event to the button
                                                            cancelButton.onclick = function() {
                                                                lastRebootTimes[minerID].hardRebootAttempted = false;
                                                                lastRebootTimes[minerID].hardRebootRecommended = new Date().toISOString();

                                                                // Save lastRebootTimes
                                                                GM_SuperValue.set('lastRebootTimes', lastRebootTimes);

                                                                // Set the details to show what it was before the hard reboot mark
                                                                rebootData[minerID].details = structuredClone(lastRebootTimes[minerID].previousDetails);

                                                                setUpRowData(row, currentMiner);
                                                            }
                                                        }

                                                        // Add a button before the question mark that says Mark Fixed
                                                        if(minerRebootData.details.main === "Hard Reboot Recommended" || minerRebootData.details.main === "Pull Recommended") {
                                                            const pullButton = document.createElement('button');
                                                            pullButton.textContent = 'Mark Fixed';
                                                            pullButton.style.cssText = `
                                                                background-color: #28a745; /* Green background */
                                                                color: white;
                                                                border: none;
                                                                cursor: pointer;
                                                                border-radius: 5px;
                                                                transition: background-color 0.3s;
                                                                margin-left: 5px;
                                                            `;
                                                            row.querySelector('td:last-child').appendChild(pullButton);

                                                            // Add button hover effect
                                                            pullButton.addEventListener('mouseenter', function() {
                                                                this.style.backgroundColor = '#218838'; /* Darker green on hover */
                                                            });

                                                            pullButton.addEventListener('mouseleave', function() {
                                                                this.style.backgroundColor = '#28a745'; /* Original green */
                                                            });

                                                            // Add click event to the button
                                                            pullButton.onclick = function() {
                                                                lastRebootTimes[minerID] = {};

                                                                // Save lastRebootTimes
                                                                GM_SuperValue.set('lastRebootTimes', lastRebootTimes);

                                                                // Set the details to show that it is hard rebooting
                                                                rebootData[minerID].details.main = "Marked Fixed";
                                                                rebootData[minerID].details.sub = ["Miner has been marked as fixed.", "Erased hard reboot mark time."];

                                                                setUpRowData(row, currentMiner);
                                                                rebootData[minerID] = {};
                                                            }
                                                        }

                                                        // Add a button before the question mark that says Send Manual Soft Reboot if details.main === "Soft Reboot Skipped"
                                                        if(minerRebootData.details.main === "Soft Reboot Skipped") {
                                                            const softRebootButton = document.createElement('button');
                                                            softRebootButton.textContent = 'Send Soft Reboot Anyway';
                                                            softRebootButton.style.cssText = `
                                                                background-color: #0078d4;
                                                                color: white;
                                                                border: none;
                                                                cursor: pointer;
                                                                border-radius: 5px;
                                                                transition: background-color 0.3s;
                                                                margin-left: 5px;
                                                            `;
                                                            row.querySelector('td:last-child').appendChild(softRebootButton);

                                                            // Add button hover effect
                                                            softRebootButton.addEventListener('mouseenter', function() {
                                                                this.style.backgroundColor = '#005a9e';
                                                            });

                                                            softRebootButton.addEventListener('mouseleave', function() {
                                                                this.style.backgroundColor = '#0078d4';
                                                            });

                                                            // Add click event to the button
                                                            softRebootButton.onclick = function() {
                                                                const minerIdList = [minerID];
                                                                const min15 = 15*60;

                                                                rebootData[minerID].details.main = "Sent Manual Soft Reboot";
                                                                rebootData[minerID].details.sub.push("Manually sent soft reboot.");

                                                                // Update the lastRebootTimes
                                                                lastRebootTimes[minerID] = lastRebootTimes[minerID] || {};
                                                                lastRebootTimes[minerID].upTimeAtReboot = currentMiner.uptimeValue;
                                                                lastRebootTimes[minerID].softRebootsTimes = lastRebootTimes[minerID].softRebootsTimes || [];
                                                                lastRebootTimes[minerID].softRebootsTimes.push(new Date().toISOString());

                                                                // Save lastRebootTimes
                                                                GM_SuperValue.set('lastRebootTimes', lastRebootTimes);

                                                                // Actually send the reboot request
                                                                serviceInstance.post(`/RebootMiners`, { miners: [minerID], bypassed: false })
                                                                    .then(() => {
                                                                        console.log("Rebooted Miner: " + minerID);
                                                                    })
                                                                    .catch((error) => {
                                                                        console.error("Failed to reboot Miner: " + minerID, error);
                                                                    });

                                                                setUpRowData(row, currentMiner);
                                                            }
                                                        }
                                                        
                                                        // Custom right click context menu when right clicking on the row
                                                        row.addEventListener('contextmenu', (e) => {
                                                            e.preventDefault();
                                                            const contextMenu = document.createElement('div');
                                                            contextMenu.style.cssText = `
                                                                position: absolute;
                                                                top: ${e.clientY}px;
                                                                left: ${e.clientX}px;
                                                                background-color: #333;
                                                                color: white;
                                                                padding: 10px;
                                                                border-radius: 5px;
                                                                z-index: 9999;
                                                                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
                                                            `;
                                                            document.body.appendChild(contextMenu);

                                                            // If a context menu was already open, this should close it
                                                            document.body.click();

                                                            // Remove the context menu when clicking outside of it
                                                            document.addEventListener('click', () => contextMenu.remove());

                                                            const buttons = [
                                                                { text: 'Set Should Hard Reboot', onClick: setShouldHardReboot },
                                                                { text: 'Set Should Pull', onClick: setShouldPull },
                                                                { text: 'Mark Fixed', onClick: markFixed }
                                                            ];

                                                            buttons.forEach(({ text, onClick }) => {
                                                                const button = document.createElement('button');
                                                                button.textContent = text;
                                                                button.style.cssText = `
                                                                    display: block;
                                                                    width: 100%;
                                                                    background: none;
                                                                    color: white;
                                                                    border: none;
                                                                    cursor: pointer;
                                                                    padding: 10px;
                                                                    text-align: left;
                                                                    transition: background-color 0.3s;
                                                                `;
                                                                button.addEventListener('mouseenter', () => button.style.backgroundColor = '#555');
                                                                button.addEventListener('mouseleave', () => button.style.backgroundColor = 'transparent');
                                                                button.onclick = () => {
                                                                    onClick();
                                                                    contextMenu.remove();
                                                                };
                                                                contextMenu.appendChild(button);
                                                            });
                                                            
                                                            function setShouldHardReboot() {
                                                                lastRebootTimes[minerID].hardRebootAttempted = false;
                                                                lastRebootTimes[minerID].hardRebootRecommended = new Date().toISOString();
                                                                lastRebootTimes[minerID].manualHardReboot = true;
                                                                GM_SuperValue.set('lastRebootTimes', lastRebootTimes);
                                                                rebootData[minerID].details.main = "Hard Reboot Recommended";
                                                                rebootData[minerID].details.sub = ["Manually set should hard reboot."];
                                                                setUpRowData(row, currentMiner);
                                                            }

                                                            function setShouldPull() {
                                                                lastRebootTimes[minerID].hardRebootAttempted = true;
                                                                lastRebootTimes[minerID].hardRebootRecommended = false;
                                                                lastRebootTimes[minerID].manualHardReboot = false;

                                                                rebootData[minerID].details.main = "Pull Recommended";
                                                                rebootData[minerID].details.sub = ["Manually set should pull."];

                                                                // make a copy of the details data
                                                                lastRebootTimes[minerID].previousDetails = structuredClone(rebootData[minerID].details);
                                                                
                                                                GM_SuperValue.set('lastRebootTimes', lastRebootTimes);
                                                                
                                                                setUpRowData(row, currentMiner);
                                                            }

                                                            function markFixed() {
                                                                lastRebootTimes[minerID] = {};
                                                                GM_SuperValue.set('lastRebootTimes', lastRebootTimes);
                                                                rebootData[minerID].details.main = "Marked Fixed";
                                                                rebootData[minerID].details.sub = ["Manually marked fixed.", "Erased stored reboot data."];
                                                                setUpRowData(row, currentMiner);
                                                                rebootData[minerID] = {};
                                                            }
                                                        });
                                                        
                                                        // Add hover event listeners to show/hide the full details
                                                        const questionMark = row.querySelector('td:last-child div[style*="position: relative;"]');
                                                        const tooltip = questionMark.querySelector('div[style*="display: none;"]');
                                                        document.body.appendChild(tooltip);
                                                        questionMark.addEventListener('mouseenter', () => {
                                                            tooltip.style.display = 'block';

                                                            // Position the tooltip to the left of the question mark with the added width
                                                            const questionMarkRect = questionMark.getBoundingClientRect();
                                                            const tooltipRect = tooltip.getBoundingClientRect();
                                                            tooltip.style.left = `${questionMarkRect.left - tooltipRect.width}px`;
                                                            tooltip.style.right = 'auto';

                                                            // Set top position to be the same as the question mark
                                                            tooltip.style.top = `${questionMarkRect.top}px`;
                                                        });

                                                        
                                                        // Start a timer to hide the tooltip after a delay if not hovered over
                                                        let hideTooltipTimer;
                                                        const hideTooltipWithDelay = () => {
                                                            hideTooltipTimer = setTimeout(() => {
                                                                tooltip.style.display = 'none';
                                                            }, 100);
                                                        };

                                                        tooltip.style.display = 'none';

                                                        // Clear the timer if the tooltip or question mark is hovered over again
                                                        questionMark.addEventListener('mouseenter', () => {
                                                            clearTimeout(hideTooltipTimer);
                                                        });

                                                        tooltip.addEventListener('mouseenter', () => {
                                                            clearTimeout(hideTooltipTimer);
                                                        });

                                                        // Start the timer when the mouse leaves the tooltip or question mark
                                                        questionMark.addEventListener('mouseleave', hideTooltipWithDelay);
                                                        tooltip.addEventListener('mouseleave', hideTooltipWithDelay);

                                                        // Observe for changes to the table and delete the tooltip if so
                                                        const observer = new MutationObserver(() => {
                                                            tooltip.remove();
                                                            observer.disconnect();
                                                        });

                                                        observer.observe(row, { childList: true });

                                                        // Proper stuck at 0 uptime check
                                                        const mightBeStuck = "Miner might be stuck at 0 uptime? Please wait for confirmation check...";
                                                        if(minerRebootData.details.sub.includes(mightBeStuck)) {
                                                            // Check if the miner has had no uptimes within 30 minutes
                                                            
                                                            retrieveMinerData("MinerHashrate", minerID, 60*30, function(minerID, minerMinerHashrates) {
                                                                // Loop through the hashrates and check for any 0 hashrates
                                                                let hasHashrate = false;
                                                                let previouHashrate = 0;
                                                                let zeroCount = 0;
                                                                let lastHashrateTime = -1;
                                                                for (const [index, data] of Object.entries(minerMinerHashrates)) {
                                                                    let timestamp = data[0];
                                                                    let hashrate = data[1];

                                                                    if (hashrate === 0 && previouHashrate > 0) {
                                                                        zeroCount++;
                                                                    }

                                                                    console.log("Hashrate: " + hashrate);
                                                                    if (hashrate > 0) {
                                                                        hasHashrate = true;
                                                                        lastHashrateTime = timestamp
                                                                        console.log("Has Hashrate: " + hasHashrate);
                                                                    }
                                                                    previouHashrate = hashrate;
                                                                }
                                                                
                                                                if(!hasHashrate) {
                                                                    rebootData[minerID].details.sub.push("Miner has not hashed in the last 30 minutes.");
                                                                    
                                                                    if(rebootData[minerID].details.main === "Soft Reboot Skipped") {
                                                                        rebootData[minerID].details.main = "Hard Reboot Recommended";
                                                                        rebootData[minerID].details.color = 'orange';
                                                                        lastRebootTimes[minerID].hardRebootRecommended = new Date().toISOString();
                                                                        GM_SuperValue.set('lastRebootTimes', lastRebootTimes);
                                                                    }
                                                                } else if(zeroCount > 3) {
                                                                    rebootData[minerID].details.sub.push("Miner has had numerous non hashing times in the last 30 minutes.");
                                                                    rebootData[minerID].details.sub.push("Non Hashing Count: " + zeroCount);
                                                                    
                                                                    if(rebootData[minerID].details.main === "Soft Reboot Skipped") {
                                                                        rebootData[minerID].details.main = "Hard Reboot Recommended";
                                                                        rebootData[minerID].details.color = 'orange';
                                                                        lastRebootTimes[minerID].hardRebootRecommended = new Date().toISOString();
                                                                        GM_SuperValue.set('lastRebootTimes', lastRebootTimes);
                                                                    }
                                                                }

                                                                if(hasHashrate) {
                                                                    let lastHashrateTimeDate = new Date(lastHashrateTime);
                                                                    let formattedTime = lastHashrateTimeDate.toLocaleTimeString();
                                                                    rebootData[minerID].details.sub.push("Last Hashrate Time: " + formattedTime);

                                                                    let nonHashingTime = new Date() - lastHashrateTimeDate;
                                                                    let nonHashingTimeFormatted = formatUptime(nonHashingTime/1000);
                                                                    rebootData[minerID].details.sub.push("Non Hashing for: " + nonHashingTimeFormatted);    
                                                                }

                                                                retrieveMinerData("MinerOnline", minerID, 60*30, function(minerID, minerUptime) {
                                                                    // Loop through the uptime and check for any uptimes
                                                                    var hasUptime = false;
                                                                    var previouState = '1';
                                                                    var downCount = 0;
                                                                    var lastOnlineTime = 0;
                                                                    for (const [index, data] of Object.entries(minerUptime)) {
                                                                        var timestamp = data[0];
                                                                        var state = data[1];

                                                                        if (state === '0' && previouState === '1') {
                                                                            downCount++;
                                                                        }

                                                                        if (state === '1') {
                                                                            hasUptime = true;
                                                                            lastOnlineTime = timestamp;
                                                                        }
                                                                        previouState = state;
                                                                    }

                                                                    // Remove the might be stuck at 0 uptime message if the miner has had uptimes
                                                                    rebootData[minerID].details.sub = rebootData[minerID].details.sub.filter(sub => sub !== mightBeStuck);

                                                                    if(!hasUptime) {
                                                                        rebootData[minerID].details.sub.push("Miner is stuck at 0 uptime, there has been no uptimes in the last 30 minutes.");
                                                                        
                                                                        if(rebootData[minerID].details.main === "Soft Reboot Skipped") {
                                                                            rebootData[minerID].details.main = "Hard Reboot Recommended";
                                                                            rebootData[minerID].details.color = 'orange';
                                                                            lastRebootTimes[minerID].hardRebootRecommended = new Date().toISOString();
                                                                            GM_SuperValue.set('lastRebootTimes', lastRebootTimes);
                                                                        }
                                                                    } else {
                                                                        if(downCount > 2) {
                                                                            rebootData[minerID].details.sub.push("Miner has had numerous downtimes in the last 30 minutes.");
                                                                            rebootData[minerID].details.sub.push("Offline Count: " + downCount);
                                                                            
                                                                            if(rebootData[minerID].details.main === "Soft Reboot Skipped") {
                                                                                rebootData[minerID].details.main = "Hard Reboot Recommended";
                                                                                rebootData[minerID].details.color = 'orange';
                                                                                lastRebootTimes[minerID].hardRebootRecommended = new Date().toISOString();
                                                                                GM_SuperValue.set('lastRebootTimes', lastRebootTimes);
                                                                            }
                                                                        }
                                                                        let lastOnlineTimeDate = new Date(lastOnlineTime);
                                                                        let formattedTime = lastOnlineTimeDate.toLocaleTimeString();
                                                                        rebootData[minerID].details.sub.push("Last Online Time: " + formattedTime);

                                                                        let offlineTime = new Date() - lastOnlineTimeDate;
                                                                        let offlineTimeFormatted = formatUptime(offlineTime/1000);
                                                                        rebootData[minerID].details.sub.push("Offline for: " + offlineTimeFormatted);
                                                                    }

                                                                    setUpRowData(row, currentMiner);
                                                                });
                                                            });
                                                        }
                                                    }

                                                    var showSkipped = true;
                                                    var showSuccess = true;
                                                    var showSleepMode = true;
                                                    function toggleSkippedMiners() {
                                                        // Get the current sort order before refreshing
                                                        var reversed = $('#minerTable').DataTable().order()[0][1] === 'desc';

                                                        const tableRows = popupResultElement.querySelectorAll('tbody tr');
                                                        tableRows.forEach(row => {
                                                            var curResultText = row.querySelector('td:last-child').textContent;
                                                            if(curResultText.includes("Soft Reboot Skipped") || curResultText.includes("Waiting on Soft Reboot Result") || curResultText.includes("Sent Soft Reboot")) {
                                                                row.style.display = showSkipped ? '' : 'none';
                                                            }
                                                            if(curResultText.includes("Successfully Hashing")) {
                                                                row.style.display = showSuccess ? '' : 'none';
                                                            }
                                                            if(curResultText.includes("Sleep Mode")) {
                                                                row.style.display = showSleepMode ? '' : 'none';
                                                            }
                                                        });

                                                        // If the table is grouped, resort by Slot ID & Breaker
                                                        const slotIDBreakerIndex = Array.from(popupResultElement.querySelector('thead').querySelectorAll('th')).findIndex(th => th.textContent === 'Slot ID & Breaker');
                                                        var grouped = $('#minerTable').attr('isGrouped');
                                                        if (grouped === 'true') {
                                                            const table = $('#minerTable').DataTable();
                                                            orderType = reversed ? 'desc' : 'asc';
                                                            table.order([slotIDBreakerIndex, orderType]).draw();
                                                        }
                                                    }

                                                    // Refresh button functionality
                                                    refreshAutoRebootButton.onclick = function() {

                                                        if(rebootAllMiners) {
                                                            const finishedHardRebootsButton = document.querySelector('#finishedHardReboots');
                                                            finishedHardRebootsButton.click();
                                                            startScan(timeFrame, autoreboot, rebootAllMiners);
                                                            return
                                                        }

                                                        var currentTableScroll = popupResultElement.querySelector('#minerTableDiv').scrollTop;

                                                        refreshText.textContent = `Refreshing...`;
                                                        targetTime = false; // Stop the countdown

                                                        // Just completly cover the table element with a invisible div to hackily prevent the user from clicking the table
                                                        const invisibleDiv = document.createElement('div');
                                                        invisibleDiv.style.position = 'absolute';
                                                        invisibleDiv.style.top = '0';
                                                        invisibleDiv.style.left = '0';
                                                        invisibleDiv.style.width = '100%';
                                                        invisibleDiv.style.height = '100%';
                                                        invisibleDiv.style.zIndex = '9999';
                                                        var actualTable = popupResultElement.querySelector('#minerTable');
                                                        actualTable.appendChild(invisibleDiv);

                                                        // Reset the scan
                                                        reachedScanEnd = false;
                                                        currentMinerIndex = 0;
                                                        
                                                        rebootData = {};

                                                        function refreshTableLogic(rebootMiners) {
                                                            
                                                            //console.log("Refreshed issue miners:", rebootMiners);

                                                            let rebootMinersLookup = {};
                                                            rebootMiners.forEach(miner => {
                                                                rebootMinersLookup[miner.id] = miner;
                                                            });

                                                            // Get what we're currently sorting by
                                                            var orderColumn = $('#minerTable').attr('colIndex') || 0;
                                                            var orderType = $('#minerTable').attr('orderType') || 'asc';
                                                            var grouped = $('#minerTable').attr('isGrouped');

                                                            // Loop through the table and heighlight the miner we're currently on for 0.5 seconds
                                                            var currentRow = 0;
                                                            var tableRows = popupResultElement.querySelectorAll('tbody tr');
                                                            tableRows.forEach((row, index) => {
                                                                let minerID = row.minerID;
                                                                let currentMiner = rebootMinersLookup[minerID];

                                                                if(minerID) {
                                                                    rebootData[minerID] = rebootData[minerID] || {};
                                                                    rebootData[minerID].details = rebootData[minerID].details || {};
                                                                }
                                                                
                                                                // If the miner had been set to have a hard reboot recommend, then let's skip the check as we want to wait until the user marks that it has been hard rebooted
                                                                if(minerID && rebootData[minerID].details.main !== "Hard Reboot Recommended") {
                                                                    // Check the miner (If the currentMiner is no longer valid, then we can assume it is hashing again since it is no longer in the issue miners)
                                                                    if(!currentMiner) {
                                                                        let rowMinerDataCopy = row.minerDataCopy;
                                                                        rebootData[minerID] = rebootData[minerID] || {};
                                                                        rebootData[minerID].details = {};
                                                                        rebootData[minerID].details.main = "Successfully Hashing";
                                                                        rebootData[minerID].details.sub = ["Miner is now hashing again."];
                                                                        rebootData[minerID].details.color = '#218838';
                                                                        setUpRowData(row, rowMinerDataCopy);
                                                                    } else if(currentMiner) {
                                                                        parseMinerUpTimeData(currentMiner, timeFrame, (currentMiner, timeFrame,) => {
                                                                            setUpRowData(row, currentMiner);
                                                                        });
                                                                    }
                                                                }
                                                            });

                                                            
                                                            // Find any new miners in the rebootMiners that are not in the table
                                                            for (const miner of rebootMiners) {
                                                                if (miner === undefined || miner === null || !miner.id) {
                                                                    continue;
                                                                }

                                                                var found = false;
                                                                tableRows = popupResultElement.querySelectorAll('tbody tr');
                                                                tableRows.forEach((row, index) => {
                                                                    let minerID = row.minerID;
                                                                    if(minerID === miner.id) {
                                                                        found = true;
                                                                    }
                                                                });

                                                                if (!found) {
                                                                    parseMinerUpTimeData(miner, timeFrame, (miner) => {
                                                                        rebootData[miner.id] = rebootData[miner.id] || {};
                                                                        rebootData[miner.id].details = rebootData[miner.id].details || {};
                                                                        rebootData[miner.id].details.sub = rebootData[miner.id].details.sub || [];
                                                                        rebootData[miner.id].details.sub.push("Just added to the table.");
                                                                        var newRow = document.createElement('tr');
                                                                        popupResultElement.querySelector('tbody').appendChild(newRow);
                                                                        setUpRowData(newRow, miner);

                                                                        // draw the row
                                                                        setTimeout(() => {
                                                                            $('#minerTable').DataTable().row.add(newRow).draw();
                                                                        }, 0);
                                                                    });
                                                                }
                                                            }

                                                            toggleSkippedMiners();

                                                            // Reset the target time
                                                            targetTime = Date.now() + countdown * 1000;

                                                            // Delete the invisible div to allow the user to click the table again
                                                            invisibleDiv.remove();

                                                            // Set the scan text to say "Refreshing in (60s)"
                                                            refreshText.textContent = `Refreshing in (${countdown}s)`;

                                                            // Set the scanned miners text
                                                            let newTotal = 0;
                                                            tableRows.forEach((row, index) => {
                                                                if(row.minerID) {
                                                                    newTotal++;
                                                                }
                                                            });
                                                            percentageText.textContent = '100% (' + newTotal + '/' + newTotal + ')';

                                                            // Resort the table
                                                            if (grouped === "false") {
                                                                $('#minerTable').DataTable().order([orderColumn, orderType]).draw();
                                                            }

                                                            // Save these back, since it weirdly gets messed up...?
                                                            $('#minerTable').attr('colIndex', orderColumn);
                                                            $('#minerTable').attr('orderType', orderType);
                                                            $('#minerTable').attr('isGrouped', grouped);
                                                        }

                                                        if(rebootAllMiners) {
                                                            updateAllMinersData(true, (allMiners) => {
                                                                //Loop through the allMiners and check their hashrate efficiency
                                                                for (let index = allMiners.length - 1; index >= 0; index--) {
                                                                    const currentMiner = allMiners[index];
                                                                    const expectedHash = currentMiner.expectedHashRate || 0;
                                                                    const currentHash = currentMiner.hashrate || 0;
                                                                    const hashEfficiency = Math.round((currentHash / expectedHash) * 100);

                                                                    let hashRatePercent = currentMiner.hashRatePercent || 0;
                                                                    hashRatePercent = hashRatePercent * 100;
                                                                    // If the miner is at or above the rebootAllMiners threshold, then remove it from the list
                                                                    if(hashEfficiency >= rebootAllMiners || hashRatePercent >= rebootAllMiners) {
                                                                        allMiners.splice(index, 1);
                                                                        continue;
                                                                    }
                                                                }

                                                                refreshTableLogic(allMiners);
                                                            });
                                                        } else {
                                                            retrieveIssueMiners((issueMiners) => {
                                                                // Only get the actual non hashing miners
                                                                issueMiners = issueMiners.filter(miner => miner.hashrate === 0 || miner.issueType === 'Non Hashing');
                                                                refreshTableLogic(issueMiners);
                                                            });
                                                        }
                                                    };

                                                    // Add text saying the current soft rebooting miners from getTotalRebootCount() that updates
                                                    const softRebootingMinersText = document.createElement('div');
                                                    softRebootingMinersText.style.cssText = `
                                                        padding: 10px;
                                                        background-color: #444947;
                                                        border-radius: 10px;
                                                        margin-top: 10px;
                                                    `;
                                                    // Position the text in the top left corner
                                                    softRebootingMinersText.style.top = '20px';
                                                    softRebootingMinersText.style.left = '30px';
                                                    softRebootingMinersText.style.position = 'absolute';
                                                    firstDiv.appendChild(softRebootingMinersText);
                                                    softRebootingMinersText.textContent = `Sent Soft Reboots: ${getTotalRebootCount()[0]}/${maxRebootAllowed}${getTotalRebootCount()[1]}`;

                                                    const softRebootingMinersTextInterval = setInterval(() => {
                                                        const rebootData = getTotalRebootCount();
                                                        const resetTime = rebootData[1];
                                                        const firstReboot = lastRebootTimes[Object.keys(lastRebootTimes)[0]];
                                                        softRebootingMinersText.textContent = `Sent Soft Reboots: ${rebootData[0]}/${maxRebootAllowed}${resetTime}`;
                                                    }, 1000);

                                                    /*
                                                    // Set the progress bar to below the table
                                                    progressBar.style.marginTop = '10px';
                                                    progressBar.style.width = '100%';
                                                    progressBar.style.height = '20px';
                                                    progressBar.style.backgroundColor = 'gray';
                                                    progressBar.style.border = '2px solid black';
                                                    var tableDiv = popupResultElement.querySelector('#minerTableDiv');
                                                    // Append after
                                                    tableDiv.parentNode.insertBefore(progressBar, tableDiv.nextSibling);
                                                    */
                                                    
                                                    // Hide the progress bar
                                                    progressBar.style.display = 'none';

                                                    // Show/Hide Skipped Miners (Aligned to the right side)
                                                    const showSkippedButton = document.createElement('button');
                                                    showSkippedButton.id = 'showSkippedButton';
                                                    showSkippedButton.style.cssText = `
                                                        padding: 10px 20px;
                                                        background-color: #0078d4;
                                                        color: white;
                                                        border: none;
                                                        cursor: pointer;
                                                        margin-top: 10px;
                                                        border-radius: 5px;
                                                        transition: background-color 0.3s;
                                                        align-self: flex-end; /* Align to the right side */
                                                        display: block; /* Ensure the button is displayed as a block element */
                                                    `;
                                                    showSkippedButton.textContent = 'Hide Soft Reboot Miners';
                                                    firstDiv.appendChild(showSkippedButton);

                                                    // Add button hover effect
                                                    showSkippedButton.addEventListener('mouseenter', function() {
                                                        this.style.backgroundColor = '#005a9e';
                                                    });

                                                    showSkippedButton.addEventListener('mouseleave', function() {
                                                        this.style.backgroundColor = '#0078d4';
                                                    });

                                                    // Show/Hide Skipped Miners functionality
                                                    showSkippedButton.onclick = function() {
                                                        showSkipped = !showSkipped;
                                                        toggleSkippedMiners();

                                                        // Set the button text to the opposite of what it was
                                                        this.textContent = showSkipped ? 'Hide Soft Reboot Miners' : 'Show Soft Reboot Miners';
                                                    };

                                                    // Add a toggle button to hide/show successful miners
                                                    const showSuccessfulButton = document.createElement('button');
                                                    showSuccessfulButton.id = 'showSuccessfulButton';
                                                    showSuccessfulButton.style.cssText = `
                                                        padding: 10px 20px;
                                                        background-color: #0078d4;
                                                        color: white;
                                                        border: none;
                                                        cursor: pointer;
                                                        margin-top: 10px;
                                                        border-radius: 5px;
                                                        transition: background-color 0.3s;
                                                        align-self: flex-end; /* Align to the right side */
                                                        display: block; /* Ensure the button is displayed as a block element */
                                                    `;

                                                    showSuccessfulButton.textContent = 'Hide Successful Miners';
                                                    firstDiv.appendChild(showSuccessfulButton);

                                                    // Add button hover effect
                                                    showSuccessfulButton.addEventListener('mouseenter', function() {
                                                        this.style.backgroundColor = '#005a9e';
                                                    });

                                                    showSuccessfulButton.addEventListener('mouseleave', function() {
                                                        this.style.backgroundColor = '#0078d4';
                                                    });

                                                    // Show/Hide Successful Miners functionality
                                                    showSuccessfulButton.onclick = function() {
                                                        showSuccess = !showSuccess;
                                                        toggleSkippedMiners();

                                                        // Set the button text to the opposite of what it was
                                                        this.textContent = showSuccess ? 'Hide Successful Miners' : 'Show Successful Miners';
                                                    };

                                                    // Toggle Sleep Mode Miners
                                                    const toggleSleepModeButton = document.createElement('button');
                                                    toggleSleepModeButton.id = 'toggleSleepModeButton';
                                                    toggleSleepModeButton.style.cssText = `
                                                        padding: 10px 20px;
                                                        background-color: #0078d4;
                                                        color: white;
                                                        border: none;
                                                        cursor: pointer;
                                                        margin-top: 10px;
                                                        border-radius: 5px;
                                                        transition: background-color 0.3s;
                                                        align-self: flex-end; /* Align to the right side */
                                                        display: block; /* Ensure the button is displayed as a block element */
                                                    `;
                                                    toggleSleepModeButton.textContent = 'Hide Sleep Mode Miners';
                                                    firstDiv.appendChild(toggleSleepModeButton);
                                                    
                                                    // Add button hover effect
                                                    toggleSleepModeButton.addEventListener('mouseenter', function() {
                                                        this.style.backgroundColor = '#005a9e';
                                                    });

                                                    toggleSleepModeButton.addEventListener('mouseleave', function() {
                                                        this.style.backgroundColor = '#0078d4';
                                                    });

                                                    // Toggle Sleep Mode Miners functionality
                                                    toggleSleepModeButton.onclick = function() {
                                                        showSleepMode = !showSleepMode;
                                                        toggleSkippedMiners();

                                                        // Set the button text to the opposite of what it was
                                                        this.textContent = showSleepMode ? 'Hide Sleep Mode Miners' : 'Show Sleep Mode Miners';
                                                    };

                                                    // Get the 3 toggle buttons, find the longest one, and set the other two to the same width
                                                    const buttons = [showSkippedButton, showSuccessfulButton, toggleSleepModeButton];
                                                    buttons.forEach(button => button.style.width = `${200}px`);
                                                    

                                                    /*
                                                    // Add a checkbox for "Include Low Hashing Miners"
                                                    const includeLowHashingMinersContainer = document.createElement('div');
                                                    includeLowHashingMinersContainer.style.cssText = `
                                                        display: flex;
                                                        align-items: center;
                                                        margin-top: 10px;
                                                        align-self: flex-end;
                                                    `;
                                                    firstDiv.appendChild(includeLowHashingMinersContainer);
                                                    

                                                    const includeLowHashingMinersCheckbox = document.createElement('input');
                                                    includeLowHashingMinersCheckbox.id = 'includeLowHashingMinersCheckbox';
                                                    includeLowHashingMinersCheckbox.type = 'checkbox';
                                                    includeLowHashingMinersCheckbox.style.cssText = `
                                                        margin-right: 5px;
                                                    `;
                                                    includeLowHashingMinersContainer.appendChild(includeLowHashingMinersCheckbox);

                                                    // Add a label for the checkbox
                                                    const includeLowHashingMinersLabel = document.createElement('label');
                                                    includeLowHashingMinersLabel.htmlFor = 'includeLowHashingMinersCheckbox';
                                                    includeLowHashingMinersLabel.textContent = 'Include Low Hashing Miners';
                                                    includeLowHashingMinersContainer.appendChild(includeLowHashingMinersLabel);
                                                    */

                                                    // Add the "Finished Hard Reboots" button
                                                    const finishedButton = document.createElement('button');
                                                    finishedButton.id = 'finishedHardReboots';
                                                    finishedButton.style.cssText = `
                                                        padding: 10px 20px;
                                                        background-color: #4CAF50;
                                                        color: white;
                                                        border: none;
                                                        cursor: pointer;
                                                        margin-top: 10px;
                                                        border-radius: 5px;
                                                        transition: background-color 0.3s;
                                                        align-self: flex-start; /* Align to the left side */
                                                        display: block; /* Ensure the button is displayed as a block element */
                                                    `;
                                                    finishedButton.textContent = 'Close Auto Reboot Scan';
                                                    firstDiv.appendChild(finishedButton);

                                                    // Set the popupResultElement to be aligned to the left side
                                                    firstDiv.style.left = '41%'

                                                    // Now that the button is created, we can attach event listeners
                                                    const finishedHardRebootsButton = popupResultElement.querySelector('#finishedHardReboots');

                                                    // Add button hover effect
                                                    finishedHardRebootsButton.addEventListener('mouseenter', function() {
                                                        this.style.backgroundColor = '#45a049';
                                                    });

                                                    finishedHardRebootsButton.addEventListener('mouseleave', function() {
                                                        this.style.backgroundColor = '#4CAF50';
                                                    });

                                                    // Close button functionality
                                                    finishedHardRebootsButton.onclick = function() {
                                                        popupResultElement.remove();
                                                        popupResultElement = null;

                                                        // Remove the scanning element
                                                        scanningElement.remove();
                                                        progressLog.remove();
                                                        clearInterval(scanningInterval);

                                                        // Set page title back to the original title
                                                        document.title = orginalTitle;
                                                    };

                                                    // Add the miner data to the table body
                                                    const popupTableBody = popupResultElement.querySelector('tbody');
                                                    Object.values(rebootData).forEach(data => {
                                                        const row = document.createElement('tr');
                                                        setUpRowData(row, data.miner);
                                                        popupTableBody.appendChild(row);
                                                    });

                                                    document.title = orginalTitle;

                                                    // Ensure jQuery, DataTables, and ColResize are loaded before initializing the table
                                                    $(document).ready(function() {
                                                        // Custom sorting function for slot IDs
                                                        $.fn.dataTable.ext.type.order['slot-id'] = function(d) {
                                                            // Split something like "C05-10-03-04 [37]" into an array of numbers
                                                            let numbers = d.match(/\d+/g).map(Number);

                                                            // Convert the array of numbers into a single comparable value
                                                            // For example, [5, 10, 3, 4, 30] becomes 5001003004030
                                                            let comparableValue = numbers.reduce((acc, num) => acc * 1000 + num, 0);

                                                            return comparableValue;
                                                        };
                                                        
                                                        $('#minerTable').DataTable({
                                                            paging: false,       // Disable pagination
                                                            searching: false,    // Disable searching
                                                            info: false,         // Disable table info
                                                            columnReorder: true, // Enable column reordering
                                                            responsive: true,    // Enable responsive behavior
                                                            colResize: true,      // Enable column resizing

                                                            // Use custom sorting for the "Slot ID" column
                                                            columnDefs: [
                                                                {
                                                                    targets: $('#minerTable th').filter(function() {
                                                                        return $(this).text().trim() === 'Slot ID & Breaker';
                                                                    }).index(),
                                                                    type: 'slot-id'  // Apply the custom sorting function
                                                                }
                                                            ]
                                                        });

                                                        // Sort Scan Result column
                                                        $('#minerTable').DataTable().order([4, 'asc']).draw();

                                                        // Attach event listener for column sorting
                                                        $('#minerTable').DataTable().on('order.dt', function() {

                                                            $('#minerTable').attr('colIndex', $('#minerTable').DataTable().order()[0][0]);
                                                            $('#minerTable').attr('orderType', $('#minerTable').DataTable().order()[0][1]);
                                                            
                                                            // If the table is sorted by the "Slot ID & Breaker" column, group the rows by container
                                                            const slotIDBreakerIndex = Array.from($('#minerTable th')).findIndex(th => th.textContent.includes('Slot ID & Breaker'));
                                                            if ($('#minerTable').DataTable().order()[0][0] === slotIDBreakerIndex) {
                                                                // Group rows by container
                                                                let currentContainer = null;
                                                                let containerGroup = null;
                                                                $('#minerTable tbody tr').each(function() {
                                                                    // If the row isn't hidden via display: none, group it
                                                                    if ($(this).css('display') !== 'none') {
                                                                        let container = `Container ` + $(this).find(`td:eq(${slotIDBreakerIndex})`).text().split('-')[0].substring(1);
                                                                        if (!/\d/.test(container)) {
                                                                            container = "Unknown";
                                                                        }
                                                                        if (container !== currentContainer) {
                                                                            currentContainer = container;
                                                                            const colCount = $('#minerTable thead tr th').length;
                                                                            containerGroup = $('<tr class="container-group"><td colspan="' + colCount + '" style="text-align: left; padding-left: 10px; background-color: #444947; color: white; height: 20px !important; padding: 5px; margin: 0px;">' + container + '</td></tr>');
                                                                            $(this).before(containerGroup);
                                                                        }
                                                                    }
                                                                });

                                                                // Set that the table is grouped
                                                                $('#minerTable').attr('isGrouped', 'true');
                                                            } else {
                                                                // Remove the container groups
                                                                $('.container-group').remove();

                                                                // Set that the table is not grouped
                                                                $('#minerTable').attr('isGrouped', 'false');
                                                            }
                                                        });

                                                    });
                                                });
                                            }

                                            // Add a log entry
                                            const logEntry = document.createElement('div');
                                            logEntry.textContent = `Scan Complete`;
                                            logEntry.style.padding = '10px';
                                            logEntry.style.borderTop = '1px solid white';
                                            progressLog.appendChild(logEntry);
                                        }

                                        // Scroll to the bottom of the progress log
                                        progressLog.scrollTop = progressLog.scrollHeight;
                                    }

                                    if(!autoreboot) {
                                        var expectedHashRate = currentMiner.expectedHashRate;
                                        retrieveMinerData("MinerHashrate", minerID, timeFrame, function(minerID, minerHashData) {

                                            // Loop through the hash data and check for any times it is below 80% of the expected hash rate
                                            var belowCount = 0;
                                            var totalExpectedHash = 0;
                                            var totalActualHash = 0;
                                            var hashRateDataTimeLookup = {};
                                            for (const [index, data] of Object.entries(minerHashData)) {
                                                var timestamp = data[0];
                                                var curHash = Number(data[1]);
                                                totalExpectedHash += expectedHashRate;
                                                totalActualHash += curHash;
                                                hashRateDataTimeLookup[timestamp] = curHash;
                                                if (data[1] < expectedHashRate * 0.8) {
                                                    belowCount++;
                                                }
                                            }

                                            var overallHashRate = Math.round((totalActualHash / totalExpectedHash) * 100);

                                            var totalOnlineActualHashRate = 0;
                                            var totalOnlineExpectedHashRate = 0;
                                            var onlineHashRate;

                                            // Now that we have the minerHashData, we can retrieve the uptime data
                                            retrieveMinerData("MinerOnline", minerID, timeFrame, function(minerID, minerUptime) {
                                                
                                                // Loop through the uptime and check for any downtime
                                                var minerDownTimes = 0;
                                                var previousState = '1';
                                                for (const [index, data] of Object.entries(minerUptime)) {
                                                    var timestamp = data[0];
                                                    var state = data[1];
                                                    if (state === '0' && previousState === '1') {
                                                        minerDownTimes++;
                                                    }
                                                    previousState = state;

                                                    // Get the hashrate for when we are online
                                                    if (state === '1') {
                                                        totalOnlineActualHashRate += hashRateDataTimeLookup[timestamp];
                                                        totalOnlineExpectedHashRate += expectedHashRate;
                                                    }
                                                }

                                                // Calculate the online hashrate
                                                onlineHashRate = Math.round((totalOnlineActualHashRate / totalOnlineExpectedHashRate) * 100);

                                                // Add the miner to the minersScanData object
                                                minersScanData[minerID] = minersScanData[minerID] || {};
                                                minersScanData[minerID].downTimes = minerDownTimes;
                                                minersScanData[minerID].overallHashRate = overallHashRate;
                                                minersScanData[minerID].onlineHashRate = onlineHashRate;
                                                minersScanData[minerID].miner = currentMiner;
                    
                                                // Run next miner
                                                runNextMiner();
                                            });
                                        });
                                    } else {
                                        checkMiner(minerID);
                                        runNextMiner();
                                    }

                                    if(callback) {
                                        callback(currentMiner, timeFrame);
                                    }
                                }
                                parseMinerUpTimeData(rebootMiners[0], timeFrame);

                                const waitTillDone = setInterval(() => {
                                    if (Object.keys(minersScanData).length === Object.keys(rebootMiners).length) {
                                        clearInterval(waitTillDone);

                                        // Remove the scanning element
                                        scanningElement.remove();
                                        progressLog.remove();
                                        clearInterval(scanningInterval);

                                        // Create a popup element for showing the results
                                        const cols = ['IP', 'Miner', 'Offline Count', 'Overall Hash Efficiency', 'Online Hash Efficiency', 'Slot ID', 'Serial Number'];
                                        createPopUpTable(`Offline Count List (${scanTimeFrameText})`, cols, false, (popupResultElement) => {

                                            // Add the close button
                                            const closeButton = document.createElement('button');
                                            closeButton.id = 'closePopup';
                                            closeButton.style.cssText = `
                                                padding: 10px 20px;
                                                background-color: #ff5e57;
                                                color: white;
                                                border: none;
                                                cursor: pointer;
                                                margin-top: 10px;
                                                border-radius: 5px;
                                                transition: background-color 0.3s;
                                                align-self: flex-start; /* Align to the left side */
                                                display: block; /* Ensure the button is displayed as a block element */
                                            `;
                                            closeButton.textContent = 'Close';
                                            const firstDiv = popupResultElement.querySelector('div');
                                            firstDiv.appendChild(closeButton);

                                            // Now the popup is appended, we can attach event listeners
                                            const closePopupButton = popupResultElement.querySelector('#closePopup');

                                            // Add button hover effect
                                            closePopupButton.addEventListener('mouseenter', function() {
                                                this.style.backgroundColor = '#ff3832';
                                            });

                                            closePopupButton.addEventListener('mouseleave', function() {
                                                this.style.backgroundColor = '#ff5e57';
                                            });

                                            // Close button functionality
                                            closePopupButton.onclick = function() {
                                                popupResultElement.remove();
                                                popupResultElement = null;
                                            };

                                            // Add the miner data to the table body
                                            const popupTableBody = popupResultElement.querySelector('tbody');
                                            Object.keys(minersScanData).forEach(minerID => {
                                                const currentMiner =  minersScanData[minerID].miner;
                                                const minerLink = `https://foundryoptifleet.com/Content/Miners/IndividualMiner?id=${minerID}`;
                                                const minerIP = currentMiner.ipAddress;
                                                const row = document.createElement('tr');
                                                const model = currentMiner.modelName;
                                                const rebootCount = minersScanData[minerID].downTimes;
                                                const overallHashRate = minersScanData[minerID].overallHashRate;
                                                const onlineHashRate = minersScanData[minerID].onlineHashRate;
                                                const minerSlotID = currentMiner.locationName;
                                                const minerSerialNumber = currentMiner.serialNumber;
                                                row.innerHTML = `
                                                    <td style="text-align: left;"><a href="http://${currentMiner.username}:${currentMiner.passwd}@${minerIP}/" target="_blank" style="color: white;">${minerIP}</a></td>
                                                    <td style="text-align: left;"><a href="${minerLink}" target="_blank" style="color: white;">${model}</a></td>
                                                    <td style="text-align: left;">${rebootCount}</td>
                                                    <td style="text-align: left;">${overallHashRate}%</td>
                                                    <td style="text-align: left;">${onlineHashRate}%</td>
                                                    <td style="text-align: left;">${minerSlotID}</a></td>
                                                    <td style="text-align: left;">${minerSerialNumber}</td>
                                                `;
                                                popupTableBody.appendChild(row);
                                            });

                                            document.title = orginalTitle;

                                            // Ensure jQuery, DataTables, and ColResize are loaded before initializing the table
                                            $(document).ready(function() {
                                                // Custom sorting function for slot IDs
                                                $.fn.dataTable.ext.type.order['miner-id'] = function(d) {
                                                    // Split something "C05-10-3-4" into an array of just the numbers that aren't seperated by anything at all
                                                    let numbers = d.match(/\d+/g).map(Number);
                                                    //numbers.shift(); // Remove the first number since it is the miner ID
                                                    // Convert the array of numbers into a single comparable value
                                                    // For example, [10, 3, 4] becomes 100304
                                                    let comparableValue = numbers.reduce((acc, num) => acc * 1000 + num, 0);
                                                    return comparableValue;
                                                };
                                                

                                                $('#minerTable').DataTable({
                                                    paging: false,       // Disable pagination
                                                    searching: false,    // Disable searching
                                                    info: false,         // Disable table info
                                                    columnReorder: true, // Enable column reordering
                                                    responsive: true,    // Enable responsive behavior
                                                    colResize: true,      // Enable column resizing

                                                    // Use custom sorting for the "Slot ID" column
                                                    columnDefs: [
                                                        {
                                                            targets: $('#minerTable th').filter(function() {
                                                                return $(this).text().trim() === 'Slot ID';
                                                            }).index(),
                                                            type: 'miner-id'  // Apply the custom sorting function
                                                        }
                                                    ]
                                                });

                                                $('#minerTable').DataTable().draw();
                                            });
                                        });
                                    }
                                }, 500);
                            }

                            if(rebootAllMiners) {
                                updateAllMinersData(true, (allMiners) => {

                                    //Loop through the allMiners and check their hashrate efficiency
                                    for (let index = allMiners.length - 1; index >= 0; index--) {
                                        const currentMiner = allMiners[index];
                                        const expectedHash = currentMiner.expectedHashRate || 0;
                                        const currentHash = currentMiner.hashrate || "error";
                                        const hashEfficiency = currentHash !== "error" ? Math.round((currentHash / expectedHash) * 100) : "error";

                                        let hashRatePercent = currentMiner.hashRatePercent || 0;
                                        hashRatePercent = hashRatePercent * 100;
                                        // If the miner is at or above 100% efficiency, then we can remove it from the list
                                        if(hashEfficiency >= rebootAllMiners || currentHash === "error" || hashRatePercent >= rebootAllMiners) {
                                            allMiners.splice(index, 1);
                                            continue;
                                        }

                                        // if locationName contains Minden_C18, remove it
                                        if(currentMiner.locationName.includes("Minden_C18")) {
                                            allMiners.splice(index, 1);
                                            continue;
                                        }
                                    }

                                    rebootLogic(allMiners);
                                });
                            } else {
                                retrieveIssueMiners((issueMiners) => {
                                    // If we are in auto reboot mode, remove any miner that isn't completely non-hashing
                                    if (autoreboot) {
                                        issueMiners = issueMiners.filter(miner => miner.hashrate === 0 || miner.issueType === 'Non Hashing');
                                    }
                                    rebootLogic(issueMiners)
                                });
                            }
                        });
                    }

                    updateAllMinersData();

                    // Add the new scan functions
                    lastHourScan = function() {
                        startScan(60*60);
                        scanTimeFrameText = 'Last Hour';
                    }

                    last4HourScan = function() {
                        startScan(60*60*4);
                        scanTimeFrameText = 'Last 4 Hours';
                    }

                    last24HourScan = function() {
                        startScan(60*60*24);
                        scanTimeFrameText = 'Last 24 Hours';
                    }

                    last7DayScan = function() {
                        startScan(60*60*24*7);
                        scanTimeFrameText = 'Last 7 Days';
                    }

                    last30DayScan = function() {
                        startScan(60*60*24*30);
                        scanTimeFrameText = 'Last 30 Days';
                    }

                    function padSlotID(slotID) {
                        var splitSlotID = slotID.split('-');
                        var containerID = splitSlotID[0].split('_')[1];
                        var rackNum = Number(splitSlotID[1]);
                        var rowNum = Number(splitSlotID[2]);
                        var colNum = Number(splitSlotID[3]);
                        var rowWidth = 4;
                        var breakerNum = (rowNum-1)*rowWidth + colNum;

                        // Remakes the slot ID, but with added 0 padding
                        let reconstructedSlotID = `${containerID}-${rackNum.toString().padStart(2, '0')}-${rowNum.toString().padStart(2, '0')}-${colNum.toString().padStart(2, '0')}`;

                        // Adds together the slot ID and breaker number, where the breaker number is padded with spaces
                        let paddedSlotIDBreaker = `${reconstructedSlotID}  [${breakerNum.toString().padStart(2, '0')}]`;

                        return paddedSlotIDBreaker;
                    }


                    // Create a error scan button
                    const errorScanDropdown = document.createElement('div');
                    errorScanDropdown.classList.add('op-dropdown');
                    errorScanDropdown.style.display = 'inline-block';
                    errorScanDropdown.innerHTML = `
                        <button id="btnNewAction" type="button" class="m-button" onclick="issues.toggleDropdownMenu('errorScanDropdown'); return false;">
                            Error Scan
                            <m-icon name="chevron-down" class="button-caret-down" data-dashlane-shadowhost="true" data-dashlane-observed="true"></m-icon>
                        </button>
                        <div id="errorScanDropdown" class="m-dropdown-menu is-position-right" aria-hidden="true">
                            <div class="m-menu">
                                <div class="m-menu-item" onclick="errorScan(true)">
                                    All Issue Miners Scan
                                </div>
                                <div class="m-menu-item" onclick="errorScan(false)">
                                    Non-Hashing Only Scan
                                </div>
                            </div>
                        </div>
                    `;



                    // Add the auto reboot button to the right of the dropdown
                    actionsDropdown.before(errorScanDropdown);

                    errorScan = function(allScan) {
                        //
                        let [scanningElement, progressBar, progressFill, scanningText, percentageText, progressLog, logEntries, addToProgressLog, setPreviousLogDone] = createScanOverlayUI();
                        retrieveIssueMiners((issueMiners) => {
                            let currentCheckLoadedInterval = null;

                            // Animate the dots cycling
                            let dots = 0;
                            let scanningInterval = setInterval(() => {
                                dots = (dots + 1) % 4;
                                scanningText.textContent = 'Scanning' + '.'.repeat(dots);
                            }, 500);

                            // Add 'cancel' button to bottom left of the scanning element
                            const cancelButton = document.createElement('button');
                            cancelButton.classList.add('m-button');
                            cancelButton.style.position = 'absolute';
                            cancelButton.style.bottom = '10px';
                            cancelButton.style.left = '10px';
                            cancelButton.style.backgroundColor = '#ff3832';
                            cancelButton.textContent = 'Cancel';
                            cancelButton.onclick = function() {
                                clearInterval(currentCheckLoadedInterval);
                                currentCheckLoadedInterval = null;
                                clearInterval(scanningInterval);
                                scanningElement.remove();
                                progressLog.remove();
                                // loop through openedWindows
                                openedWindows.forEach(curWindow => {
                                    if (curWindow.window) {
                                        curWindow.window.close();
                                    }
                                });
                            };
                            scanningElement.appendChild(cancelButton);

                            // Hover effect for the cancel button
                            cancelButton.addEventListener('mouseenter', function() {
                                this.style.backgroundColor = '#ff5e57';
                            });

                            cancelButton.addEventListener('mouseleave', function() {
                                this.style.backgroundColor = '#ff3832';
                            });

                            // Only get the actual non hashing miners
                            offlineMiners = issueMiners.filter(miner => miner.statusName === 'Offline');
                            //issueMiners = issueMiners.filter(miner => miner.statusName === 'Online'); // && !miner.firmwareVersion.includes('BCFMiner'));
                            if(!allScan) {
                                issueMiners = issueMiners.filter(miner => miner.hashrate === 0 || miner.issueType === 'Non Hashing');
                            }
                            
                            let errorScanMiners = structuredClone(issueMiners);

                            /*
                            // loop trough errorScanMiners and fetch the log
                            errorScanMiners.forEach(miner => {
                                const minerIP = miner.ipAddress;
                                let ipHref = `http://${minerIP}/cgi-bin/log.cgi`;
                                fetchGUIData(ipHref)
                                    .then(responseText => {
                                        let errorsFound = runErrorScanLogic(responseText);
                                        errorsFound = errorsFound.filter(error => !error.unimportant);
                                        console.log("Errors Found:", errorsFound);
                                        if(errorsFound.length > 0) {

                                        } else {

                                        }
                                    })
                                    .catch(error => {
                                        console.error(error);
                                    });
                            });
                            */

                            let scanComplete = false;
                            GM_SuperValue.set('errorsFound', {});

                            if (issueMiners.length === 0 && offlineMiners.length === 0) {
                                clearInterval(scanningInterval);
                                scanningText.textContent = '[No miners to scan]';
                                return;
                            }

                            const scanMinersLookup = {};
                            issueMiners.forEach(miner => {
                                scanMinersLookup[miner.id] = structuredClone(miner);
                            });

                            let openedWindows = [];
                            let currentlyScanning = {};
                            GM_SuperValue.set('currentlyScanning', currentlyScanning);

                            let maxScan = 1; // currently WIP, anythign above 1 will cause issues

                            // fill the openedWindows array with false
                            for (let i = 0; i < maxScan; i++) {
                                openedWindows.push({window: false, nextReady: false});
                            }

                            let failLoadCount = 0;
                            let offlineCount = offlineMiners.length;
                            let noErrorCount = 0;
                            let handledOffline = false;

                            function openMinerGUILog() {
                                if(!handledOffline) {
                                    handledOffline = true;
                                    if(offlineMiners.length > 0) {
                                        offlineMiners.forEach(miner => {
                                            addToProgressLog(miner);
                                            setPreviousLogDone(miner.id, "✖", "Miner Offline, according to OptiFleet.");

                                            // Remove the miner from the errorScanMiners array
                                            errorScanMiners = errorScanMiners.filter(errorMiner => errorMiner.id !== miner.id);

                                            // Add the miner being offline to the errorsFound object
                                            const errorsFound = GM_SuperValue.get('errorsFound', {});
                                            errorsFound[miner.id] = [{
                                                name: "Miner Offline, according to OptiFleet.",
                                                short: "Miner Offline",
                                                icon: "https://img.icons8.com/?size=100&id=111057&format=png&color=FFFFFF"
                                            }];
                                            GM_SuperValue.set('errorsFound', errorsFound);
                                        });
                                    }
                                }

                                // Update the percentage text
                                percentageText.textContent = `${Math.round(((issueMiners.length - errorScanMiners.length) / issueMiners.length) * 100)}% (${issueMiners.length - errorScanMiners.length}/${issueMiners.length})`;

                                // Update the progress bar
                                progressFill.style.width = `${((issueMiners.length - errorScanMiners.length) / issueMiners.length) * 100}%`;

                                // Check if there are no miners left to scan
                                if (errorScanMiners.length === 0) {
                                    return;
                                }
                                
                                // Get first miner
                                let currentMiner = errorScanMiners[0];
                                for (let i = 1; i < errorScanMiners.length; i++) {
                                    if(currentlyScanning[currentMiner.ipAddress]) {
                                        currentMiner = errorScanMiners[i];
                                        if (i === errorScanMiners.length - 1) {
                                            return;
                                        }
                                    } else {
                                        break;
                                    }
                                }

                                const minerIP = currentMiner.ipAddress;
                                let guiLink = `http://${currentMiner.username}:${currentMiner.passwd}@${minerIP}/#blog`;
                                if(currentMiner.firmwareVersion.includes('BCFMiner')) {
                                    guiLink = `http://${currentMiner.username}:${currentMiner.passwd}@${minerIP}/#/logs`;
                                }

                                console.log("Opening miner GUI for:", currentMiner);
                                console.log("GUI Link:", guiLink);

                                // Open the miner in a new tab
                                addToProgressLog(currentMiner);

                                // loop through openedWindows
                                let currentWindowIndex = 0;
                                for (let index = 0; index < openedWindows.length; index++) {
                                    let curWindow = openedWindows[index].window;
                                    if(!curWindow || curWindow.closed) {
                                        currentlyScanning[minerIP] = currentMiner;
                                        GM_SuperValue.set('currentlyScanning', currentlyScanning);
                                        currentWindowIndex = index;
                                        let logWindow = window.open(guiLink, '_blank', 'width=1,height=1,left=0,top=' + (window.innerHeight - 400));
                                        openedWindows[index].window = logWindow;
                                        openedWindows[index].nextReady = false;
                                        break;
                                    } else if(openedWindows[index].nextReady) {
                                        currentlyScanning[minerIP] = currentMiner;
                                        GM_SuperValue.set('currentlyScanning', currentlyScanning);
                                        currentWindowIndex = index;
                                        openedWindows[index].nextReady = false;
                                        //redirect the current window to the new miner
                                        curWindow.location.href = guiLink;
                                        break;
                                    }
                                }

                                // Wait for the miner gui to load
                                let loaded = false;
                                currentCheckLoadedInterval = setInterval(() => {
                                    //const guiLoaded = GM_SuperValue.get('minerGUILoaded_' + currentMiner.id, false);
                                    const errorsFound = GM_SuperValue.get('errorsFound', false);
                                    if(errorsFound && errorsFound[currentMiner.id]) {
                                        loaded = true;
                                        const minerErrors = errorsFound[currentMiner.id] || [];
                                        let errorNames = "";
                                        minerErrors.forEach(error => {
                                            errorNames += `• ${error.name}\n`;
                                        });
                                        // if there are no errors, set the errorNames to "No Errors Found"
                                        if(errorNames === "") {
                                            errorNames = "No Errors Found";
                                            noErrorCount++;
                                        }
                                        setPreviousLogDone(currentMiner.id, "✔", errorNames);
                                        clearInterval(currentCheckLoadedInterval);
                                        
                                        //GM_SuperValue.set('minerGUILoaded_' + currentMiner.id, false);
                                        delete currentlyScanning[minerIP];
                                        GM_SuperValue.set('currentlyScanning', currentlyScanning);
                                        openedWindows[currentWindowIndex].nextReady = true;
                                        errorScanMiners.shift();
                                        openMinerGUILog();
                                    }
                                }, 10);

                                setTimeout(() => {
                                    if (!loaded && currentCheckLoadedInterval) {
                                        // Refresh the page
                                        openedWindows[currentWindowIndex].window.location.reload();
                                    }
                                }, 6000);

                                // Check if the miner gui loaded in a certain amount of time
                                setTimeout(() => {
                                    if (!loaded && currentCheckLoadedInterval) {
                                        let failText = "Failed to load miner GUI.";
                                        if(currentMiner.firmwareVersion.includes('BCFMiner')) {
                                            failText = "Failed to load miner GUI or got stuck on Username/Password prompt.";
                                        }
                                        setPreviousLogDone(currentMiner.id, "✖", failText);
                                        failLoadCount++;
                                        clearInterval(currentCheckLoadedInterval);

                                        const errorsFound = GM_SuperValue.get('errorsFound', {});
                                        errorsFound[currentMiner.id] = [{
                                            name: failText,
                                            short: "GUI Load Fail",
                                            icon: "https://img.icons8.com/?size=100&id=111057&format=png&color=FFFFFF"
                                        }];
                                        GM_SuperValue.set('errorsFound', errorsFound);

                                        // Move to the next miner
                                        delete currentlyScanning[minerIP];
                                        GM_SuperValue.set('currentlyScanning', currentlyScanning);
                                        openedWindows[currentWindowIndex].nextReady = true;
                                        errorScanMiners.shift();
                                        openMinerGUILog();
                                    }
                                }, 16000);
                            }
                            
                            for (let i = 0; i < maxScan; i++) {
                                openMinerGUILog();
                            }
                            //openMinerGUILog();

                            // Keep checking until scan is done
                            const checkScanDoneInterval = setInterval(() => {
                                let errorsFoundSave = GM_SuperValue.get('errorsFound', {});
                                if(errorScanMiners.length === 0 && Object.keys(currentlyScanning).length === 0) {

                                    if(Object.keys(errorsFoundSave).length === 0) {
                                        clearInterval(scanningInterval);
                                        scanningText.textContent = '[No errors found]';
                                    }

                                    clearInterval(checkScanDoneInterval);

                                    // Loop through all the opened windows and make sure they are closed
                                    openedWindows.forEach(curWindow => {
                                        if (curWindow.window) {
                                            curWindow.window.close();
                                        }
                                    });

                                    cancelButton.remove();

                                    const cols = ['Miner Errors'];
                                    createPopUpTable(`Error Log Scan Results`, cols, false, (popupResultElement) => {
                                        
                                        const firstDiv = popupResultElement.querySelector('div');

                                        function setUpRowData(row, currentMiner, error) {
                                            let minerID = currentMiner.id;
                                           
                                            row.innerHTML = `
                                                <td style="text-align: left; position: relative;">
                                                    ${error.name}
                                                    <div style="display: inline-block; margin-left: 5px; cursor: pointer; position: relative; float: right;">
                                                        <div style="width: 20px; height: 20px; border-radius: 50%; background-color: #0078d4; color: white; text-align: center; line-height: 20px; font-size: 12px; border: 1px solid black; font-weight: bold; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;">!</div>
                                                        <div style="display: none; position: absolute; top: 20px; right: 0; background-color: #444947; color: white; padding: 5px; border-radius: 5px; z-index: 9999; white-space: nowrap; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);">
                                                             <div style="display: flex; align-items: center; justify-content: space-between;">
                                                                <div>
                                                                    [Error Log]
                                                                </div>
                                                                <div style="display: flex; gap: 5px; align-items: center;">
                                                                    <button class="copy-button" style="padding: 5px; background-color: green; color: white; border: none; cursor: pointer; border-radius: 5px;">Copy</button>
                                                                   
                                                                </div>
                                                            </div>
                                                            <div style="display: block; padding: 5px; background-color: #444947; color: white; border-radius: 5px; margin-top: 5px; white-space: pre-wrap;">${error.text}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                            `;
                                            // <button class="create-card-button" style="padding: 5px; background-color: #0078d4; color: white; border: none; cursor: pointer; border-radius: 5px;">Create Card</button>
                                            // Add event listener for the copy button
                                            const copyButton = row.querySelector('.copy-button');
                                            copyButton.addEventListener('click', () => {
                                                const errorText = error.text;
                                                navigator.clipboard.writeText(errorText).then(() => {
                                                    console.log('Text copied to clipboard');
                                                }).catch(err => {
                                                    console.error('Failed to copy text: ', err);
                                                });
                                                
                                                // Make the button say copied
                                                copyButton.textContent = 'Copied!';
                                                setTimeout(() => {
                                                    copyButton.textContent = 'Copy';
                                                }, 1000);

                                            });

                                            /*
                                            // Add event listener for the create card button
                                            const createCardButton = row.querySelector('.create-card-button');
                                            createCardButton.addEventListener('click', () => {
                                                // Create card logic here
                                            });/ */
                                            
                                            row.minerID = minerID;
                                            row.minerDataCopy = structuredClone(currentMiner);

                                            if(!error.text) {
                                                row.innerHTML = `
                                                    <td style="text-align: left; position: relative;">
                                                        ${error.name}
                                                    </td>
                                                `;
                                            } else {

                                                var questionColor = 'red';
                                                if(questionColor) {
                                                    row.querySelector('td:last-child div[style*="position: relative;"] div').style.backgroundColor = questionColor;   
                                                }
                                                
                                                // Add hover event listeners to show/hide the full details
                                                const questionMark = row.querySelector('td:last-child div[style*="position: relative;"]');
                                                const tooltip = questionMark.querySelector('div[style*="display: none;"]');
                                                document.body.appendChild(tooltip);
                                                questionMark.addEventListener('mouseenter', () => {
                                                    tooltip.style.display = 'block';

                                                    // Position the tooltip to the left of the question mark with the added width
                                                    const questionMarkRect = questionMark.getBoundingClientRect();
                                                    const tooltipRect = tooltip.getBoundingClientRect();
                                                    tooltip.style.left = `${questionMarkRect.left - tooltipRect.width}px`;
                                                    tooltip.style.right = 'auto';

                                                    // Set top position to be the same as the question mark
                                                    tooltip.style.top = `${questionMarkRect.top}px`;
                                                });

                                                // when clicked, open the error log
                                                questionMark.addEventListener('click', () => {
                                                    const ip = currentMiner.ipAddress;
                                                    let GUILink = `http://${currentMiner.username}:${currentMiner.passwd}@${ip}/#blog`;
                                                    if(currentMiner.firmwareVersion.includes('BCFMiner')) {
                                                        GUILink = `http://${currentMiner.username}:${currentMiner.passwd}@${ip}/#/logs`;
                                                    }
                                                    GM_SuperValue.set('quickGoToLog', {ip: ip, errorText: error.text, category: error.category});
                                                    window.open(GUILink, '_blank');
                                                });

                                                
                                                // Start a timer to hide the tooltip after a delay if not hovered over
                                                let hideTooltipTimer;
                                                const hideTooltipWithDelay = () => {
                                                    hideTooltipTimer = setTimeout(() => {
                                                        tooltip.style.display = 'none';
                                                    }, 100);
                                                };

                                                tooltip.style.display = 'none';

                                                // Clear the timer if the tooltip or question mark is hovered over again
                                                questionMark.addEventListener('mouseenter', () => {
                                                    clearTimeout(hideTooltipTimer);
                                                });

                                                tooltip.addEventListener('mouseenter', () => {
                                                    clearTimeout(hideTooltipTimer);
                                                });

                                                // Start the timer when the mouse leaves the tooltip or question mark
                                                questionMark.addEventListener('mouseleave', hideTooltipWithDelay);
                                                tooltip.addEventListener('mouseleave', hideTooltipWithDelay);

                                                // Observe for changes to the table and delete the tooltip if so
                                                const observer = new MutationObserver(() => {
                                                    tooltip.remove();
                                                    observer.disconnect();
                                                });

                                                observer.observe(row, { childList: true });
                                            }
                                        }

                                        // Add the count of failLoadCount noErrorCount
                                        const containerDiv = document.createElement('div');
                                        containerDiv.style.cssText = `
                                            display: flex;
                                            gap: 10px;
                                            padding: 0px;
                                            background-color: #444947;
                                            border-radius: 10px;
                                            margin-top: 10px;
                                            align-self: flex-start;
                                        `;

                                        const failLoadCountText = document.createElement('div');
                                        failLoadCountText.style.cssText = `
                                            padding: 5px;
                                            background-color: #444947;
                                            border-radius: 5px;
                                            font-size: 0.8em;
                                        `;
                                        failLoadCountText.textContent = `GUI Load Fails: ${failLoadCount}`;

                                        const offlineCountText = document.createElement('div');
                                        offlineCountText.style.cssText = `
                                            padding: 5px;
                                            background-color: #444947;
                                            border-radius: 5px;
                                            font-size: 0.8em;
                                        `;
                                        offlineCountText.textContent = `Offline Miners: ${offlineCount}`;

                                        const noErrorCountText = document.createElement('div');
                                        noErrorCountText.style.cssText = `
                                            padding: 5px;
                                            background-color: #444947;  
                                            border-radius: 5px;
                                            font-size: 0.8em;
                                        `;
                                        noErrorCountText.textContent = `No Errors Found Miners: ${noErrorCount}`;

                                        containerDiv.appendChild(failLoadCountText);
                                        containerDiv.appendChild(offlineCountText);
                                        containerDiv.appendChild(noErrorCountText);
                                        firstDiv.appendChild(containerDiv);

                                        // Add the "Finished Hard Reboots" button
                                        const finishedButton = document.createElement('button');
                                        finishedButton.id = 'finishedHardReboots';
                                        finishedButton.style.cssText = `
                                            padding: 10px 20px;
                                            background-color: #4CAF50;
                                            color: white;
                                            border: none;
                                            cursor: pointer;
                                            margin-top: 10px;
                                            border-radius: 5px;
                                            transition: background-color 0.3s;
                                            align-self: flex-start;
                                            display: block;
                                        `;
                                        finishedButton.textContent = 'Close Error Scan Results';
                                        firstDiv.appendChild(finishedButton);

                                        // Set the popupResultElement to be aligned to the left side
                                        firstDiv.style.left = '41%'

                                        // Now that the button is created, we can attach event listeners
                                        const finishedErrorScan = popupResultElement.querySelector('#finishedHardReboots');

                                        // Add button hover effect
                                        finishedErrorScan.addEventListener('mouseenter', function() {
                                            this.style.backgroundColor = '#45a049';
                                        });

                                        finishedErrorScan.addEventListener('mouseleave', function() {
                                            this.style.backgroundColor = '#4CAF50';
                                        });

                                        // Close button functionality
                                        finishedErrorScan.onclick = function() {
                                            scanningElement.remove();
                                            progressLog.remove();
                                            clearInterval(scanningInterval);

                                            popupResultElement.remove();
                                            popupResultElement = null;
                                        };

                                        // Add the miner data to the table body
                                        const popupTableBody = popupResultElement.querySelector('tbody');

                                        // Resorts the errors alphabetically by slot ID
                                        issueMiners.sort((a, b) => {
                                            let aSlotID = a.locationName;
                                            let bSlotID = b.locationName;

                                            let aSlotIDBreaker = padSlotID(aSlotID);
                                            let bSlotIDBreaker = padSlotID(bSlotID);

                                            return aSlotIDBreaker.localeCompare(bSlotIDBreaker);
                                        });

                                        issueMiners.forEach(miner => {
                                            const minerID = miner.id;
                                            const errors = errorsFoundSave[minerID] || [];
                                           

                                            errors.forEach((error, index) => {
                                                const row = document.createElement('tr');

                                                let curMiner = scanMinersLookup[minerID];
                                                setUpRowData(row, curMiner, error);
                                                popupTableBody.appendChild(row);
                                            });
                                        });

                                        // Loop through all the rows and group together the same miners by a single row
                                        const allRows = Array.from(popupTableBody.querySelectorAll('tr'));
                                        for (let i = 0; i < allRows.length; i++) {
                                            const currentRow = allRows[i];
                                            const previousRow = allRows[i - 1] || null;
                                            let currentMiner = currentRow.minerDataCopy;
                                            let minerID = currentRow.minerID;
                                            let model = currentMiner.modelName;
                                            let slotID = currentMiner.locationName;

                                            let paddedSlotIDBreaker = padSlotID(slotID);       
    
                                            let minerSerialNumber = currentMiner.serialNumber;
                                            let minerLink = `https://foundryoptifleet.com/Content/Miners/IndividualMiner?id=${minerID}`;
                                            //http://root:root@${currentMiner.ipAddress}/

                                            // If the previous row is null or a different miner, then we need to create a new row
                                            if (!previousRow || currentRow.minerID !== previousRow.minerID) {
                                                let GUILink = `http://${currentMiner.username}:${currentMiner.passwd}@${currentMiner.ipAddress}/#blog`;
                                                if(currentMiner.firmwareVersion.includes('BCFMiner')) {
                                                    GUILink = `http://${currentMiner.username}:${currentMiner.passwd}@${currentMiner.ipAddress}/#/logs`;
                                                }

                                                const errorData = errorsFoundSave[minerID] || [];
                                                let errorCount = errorData.length;
                                                if(errorCount === 1 && !errorData[0].text) {
                                                    errorCount = '?';
                                                }

                                                let iconLinks = [];
                                                if(errorData) {
                                                    errorData.forEach(error => {
                                                        // Check if the icon already exists, if not add it, if so increment the count
                                                        if(!iconLinks.find(icon => icon.icon === error.icon)) {
                                                            iconLinks.push({icon: error.icon, count: 1, name: error.name});
                                                        } else {
                                                            iconLinks.find(icon => icon.icon === error.icon).count++;                                                            
                                                        }
                                                    });
                                                }

                                                // Create a span containing all the icons with the count to the bottom right of each.
                                                const iconSpan = document.createElement('span');
                                                iconSpan.style.cssText = `
                                                    display: inline-block;
                                                    margin-left: 0px;
                                                    float: right;
                                                    background-color: #333;
                                                    padding: 2px;
                                                    border-radius: 5px;
                                                    outline: 1px solid #000;
                                                `;
                                                
                                                iconLinks.forEach(icon => {
                                                    const iconDiv = document.createElement('div');
                                                    iconDiv.style.cssText = `
                                                        display: inline-block;
                                                        margin-top: 3px;
                                                        margin-left: -8px;
                                                    `;
                                                    iconDiv.innerHTML = `
                                                        <span style="position: relative; top: -10px; right: -10px; background-color: red; color: white; border-radius: 50%; padding: 1px 3px; font-size: 10px;">${icon.count}</span>
                                                        <img src="${icon.icon}" style="width: 18px; height: 18px; margin-right: 5px; margin-left: 0px;"/>
                                                    `;
                                                    iconSpan.appendChild(iconDiv);

                                                    // Remove the count if is less than 2
                                                    if(icon.count < 2) {
                                                        iconDiv.querySelector('span').remove();

                                                        let imgElement = iconDiv.querySelector('img');

                                                        // Adjust the icon padding/margins to account for the missing count
                                                        iconDiv.style.paddingLeft = '2px';
                                                        iconDiv.style.paddingRight = '2px';
                                                        iconDiv.style.marginLeft = '0px';
                                                        iconDiv.style.marginRight = '0px';
                                                        imgElement.style.marginLeft = '0px';
                                                        imgElement.style.marginRight = '0px';
                                                        imgElement.style.paddingLeft = '0px';
                                                        imgElement.style.paddingRight = '0px';

                                                        // Fixes the margin of the first icon
                                                        if(iconLinks.length > 1 && icon === iconLinks[0]) {
                                                            iconDiv.style.marginLeft = '1px';
                                                        }
                                                    }

                                                    // Add a tooltip to show the name of the error
                                                    const iconDivTooltip = iconDiv.querySelector('span');
                                                    const tooltip = document.createElement('div');
                                                    tooltip.style.cssText = `
                                                        display: none;
                                                        position: absolute;
                                                        background-color: #444947;
                                                        color: white;
                                                        padding: 5px 10px;
                                                        border-radius: 5px;
                                                        font-size: 12px;
                                                        z-index: 9999;
                                                        white-space: nowrap;
                                                    `;
                                                    tooltip.textContent = icon.name;
                                                    document.body.appendChild(tooltip);

                                                    // Add hover event listeners to show/hide the full details
                                                    iconDiv.addEventListener('mouseenter', () => {
                                                        tooltip.style.display = 'block';

                                                        // Calculate the position of the icon relative to the scrollable container
                                                        const iconRect = iconDiv.getBoundingClientRect();
                                                        const containerRect = iconDiv.offsetParent.getBoundingClientRect();

                                                        // Position tooltip relative to the iconDiv within the scrollable container
                                                        const tooltipOffset = 5; // Gap between the icon and tooltip
                                                        tooltip.style.top = `${iconRect.top}px`;
                                                        tooltip.style.left = `${iconRect.right}px`; 
                                                    });

                                                    iconDiv.addEventListener('mouseleave', () => {
                                                        tooltip.style.display = 'none';
                                                    });
                                                });

                                                let errorCountText = "Error Count: " + errorCount;
                                                if(errorCount === '?') {
                                                    errorCountText = errorData[0].short || errorData[0].name || "Error Count: ?";
                                                }
                                                    
                                                // Create a new row to contain the miner's information
                                                const newRow = document.createElement('tr');
                                                newRow.style.backgroundColor = '#444947';
                                                newRow.style.color = 'white';
                                                newRow.style.height = '20px !important';
                                                newRow.style.padding = '5px';
                                                newRow.style.margin = '0px';
                                                newRow.innerHTML = `
                                                    <td colspan="7" style="text-align: right; padding-right: 6px; padding-left: 6px;">
                                                        <span class="error-guilink-text" style="background-color: #333; padding: 5px; border-radius: 5px; outline: 1px solid #000; margin-left: 5px; float: left; left: 5px;">
                                                            <a href="${GUILink}" target="_blank" style="color: white;">${currentMiner.ipAddress}</a>
                                                        </span>
                                                        <span class="error-link-text" style="background-color: #333; padding: 5px; border-radius: 5px; outline: 1px solid #000; margin-left: 5px; float: left; left: 5px;">
                                                            <a href="${minerLink}" target="_blank" style="color: white;">${model}</a>
                                                        </span>
                                                        <span class="error-serialnumber-text" style="background-color: #333; padding: 5px; border-radius: 5px; outline: 1px solid #000; margin-left: 5px; float: left; left: 5px;">
                                                            ${minerSerialNumber}
                                                        </span>
                                                        <span style="background-color: #333; padding: 5px; border-radius: 5px; outline: 1px solid #000; margin-left: 5px; float: right;">
                                                            ${paddedSlotIDBreaker}
                                                        </span>
                                                        <span class="error-count-text" style="background-color: #333; padding: 5px; border-radius: 5px; outline: 1px solid #000; margin-left: 5px; float: right;">
                                                            ${errorCountText}
                                                        </span>
                                                    </td>
                                                `;
                                                newRow.querySelector('td').appendChild(iconSpan);

                                                // Add a plus/minus button to expand/collapse the category
                                                const toggleButtonSpan = document.createElement('span');
                                                toggleButtonSpan.style.cssText = `
                                                    padding: 5px;
                                                    border-radius: 5px;
                                                    outline: 1px solid #000;
                                                    margin-left: 5px;
                                                    float: left;
                                                    left: 5px;
                                                `;

                                                // Inject CSS into the document's head
                                                const style = document.createElement('style');
                                                style.textContent = `
                                                    .unselectable {
                                                        -webkit-user-select: none; // Safari
                                                        -moz-user-select: none;    // Firefox
                                                        -ms-user-select: none;     // IE 10+/Edge
                                                        user-select: none;         // Standard
                                                    }
                                                `;
                                                document.head.appendChild(style);

                                                const toggleButton = document.createElement('button');
                                                toggleButton.textContent = '-';
                                                toggleButton.style.cssText = `
                                                    background-color: #0078d4;
                                                    color: white;
                                                    border: none;
                                                    cursor: pointer;
                                                    border-radius: 5px;
                                                    padding: 5px;
                                                    margin-right: 5px;
                                                    transition: background-color 0.3s;
                                                    width: 20px;
                                                    height: 20px;
                                                    display: flex;
                                                    justify-content: center;
                                                    align-items: center;
                                                `;

                                                // Add the button to the row
                                                newRow.querySelector('td').prepend(toggleButtonSpan);
                                                toggleButtonSpan.appendChild(toggleButton);
                                                
                                                // Add the unselectable class to all the elements
                                                newRow.classList.add('unselectable');

                                                // Add button hover effect
                                                toggleButton.addEventListener('mouseenter', function() {
                                                    this.style.backgroundColor = '#005a9e';
                                                });

                                                toggleButton.addEventListener('mouseleave', function() {
                                                    this.style.backgroundColor = '#0078d4';
                                                });

                                                let lastClickTime = 0;
                                                function expandCollapseRows() {
                                                    // Prevent double clicking
                                                    const currentTime = new Date().getTime();
                                                    if (currentTime - lastClickTime < 10) {
                                                        return;
                                                    }
                                                    lastClickTime = currentTime;
                                                    const isExpanded = toggleButton.textContent === '-';
                                                    toggleButton.textContent = isExpanded ? '+' : '-';
                                                    let nextRow = newRow.nextElementSibling;
                                                    while (nextRow && nextRow.minerID === minerID) {
                                                        nextRow.style.display = isExpanded ? 'none' : '';
                                                        nextRow = nextRow.nextElementSibling;
                                                    }
                                                }

                                                // Add click event to toggle the visibility of the rows
                                                toggleButton.addEventListener('click', function() {
                                                    expandCollapseRows();
                                                });
                                                currentRow.before(newRow);

                                                //Click the button to start collapsed
                                                toggleButton.click();

                                                // Clicking on the top row will expand/collapse the category
                                                newRow.addEventListener('click', function() {
                                                    expandCollapseRows();
                                                });
                                            }
                                        }

                                        // Get all error-count-text elements, find the max width, and set all to that width
                                        const setMaxWidth = (selector) => {
                                            const elements = Array.from(popupTableBody.querySelectorAll(selector));
                                            const maxWidth = Math.max(...elements.map(text => text.offsetWidth));
                                            elements.forEach(text => {
                                                text.style.width = `${maxWidth + 2}px`;
                                                text.style.textAlign = 'center';
                                            });
                                        };

                                        setMaxWidth('.error-count-text');
                                        setMaxWidth('.error-guilink-text');
                                        setMaxWidth('.error-link-text');
                                        setMaxWidth('.error-serialnumber-text');
                                    });
                                }
                            }, 100);

                        });
                    };

                    if(siteName.includes("Minden")) {
                        // Create a auto reboot button to the right of the dropdown
                        const autoRebootButton = document.createElement('button');
                        autoRebootButton.classList.add('m-button');
                        autoRebootButton.style.marginLeft = '10px';
                        autoRebootButton.textContent = 'Auto Reboot';
                        autoRebootButton.onclick = function(event) {
                            event.preventDefault(); // Prevent the default behavior of the button

                            startScan(60*60*24*7, true, false);
                        };

                        // Add the auto reboot button to the right of the dropdown
                        actionsDropdown.before(autoRebootButton);

                        // Create a 'full' auto reboot button to the right of the dropdown
                        const fullAutoRebootButton = document.createElement('button');
                        fullAutoRebootButton.classList.add('m-button');
                        fullAutoRebootButton.style.marginLeft = '10px';
                        fullAutoRebootButton.textContent = 'Full Auto Reboot';
                        fullAutoRebootButton.onclick = function(event) {
                            event.preventDefault(); // Prevent the default behavior of the button

                            // Create popup to type in what percentage efficiency to reboot at
                            const popup = document.createElement('div');
                            popup.style.cssText = `
                                position: fixed;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                                background-color: rgba(0, 0, 0, 0.5);
                                z-index: 1000;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                            `;
                            document.body.appendChild(popup);

                            const popupContent = document.createElement('div');
                            popupContent.style.cssText = `
                                padding: 20px;
                                background-color: #333;
                                border-radius: 10px;
                            `;
                            popup.appendChild(popupContent);

                            const popupTitle = document.createElement('h2');
                            popupTitle.textContent = 'Efficiency percentage to reboot miners when at/below:';
                            popupTitle.style.color = 'white';
                            popupTitle.style.marginBottom = '10px';
                            popupContent.appendChild(popupTitle);

                            const currentEfficiency = GM_SuperValue.get('rebootEfficiency', 90);
                            const efficiencyInput = document.createElement('input');
                            efficiencyInput.type = 'number';
                            efficiencyInput.min = 0;
                            efficiencyInput.max = 100;
                            efficiencyInput.value = currentEfficiency;
                            efficiencyInput.style.width = '100%';
                            efficiencyInput.style.padding = '10px';
                            efficiencyInput.style.marginBottom = '10px';
                            efficiencyInput.style.color = 'white';
                            popupContent.appendChild(efficiencyInput);

                            const buttonsDiv = document.createElement('div');
                            buttonsDiv.style.display = 'flex';
                            buttonsDiv.style.justifyContent = 'space-between';
                            popupContent.appendChild(buttonsDiv);
                            

                            const submitButton = document.createElement('button');
                            submitButton.textContent = 'Submit';
                            submitButton.style.padding = '10px 20px';
                            submitButton.style.backgroundColor = '#0078d4';
                            submitButton.style.color = 'white';
                            submitButton.style.border = 'none';
                            submitButton.style.cursor = 'pointer';
                            submitButton.style.borderRadius = '5px';
                            submitButton.style.transition = 'background-color 0.3s';
                            submitButton.style.display = 'block';
                            submitButton.style.marginTop = '10px';
                            buttonsDiv.appendChild(submitButton);

                            submitButton.addEventListener('mouseenter', function() {
                                this.style.backgroundColor = '#005a9e';
                            });

                            submitButton.addEventListener('mouseleave', function() {
                                this.style.backgroundColor = '#0078d4';
                            });

                            submitButton.onclick = function() {
                                const efficiency = efficiencyInput.value;
                                GM_SuperValue.set('rebootEfficiency', efficiency);
                                startScan(60*60*24*7, true, efficiency);
                                popup.remove();
                            }

                            const closeButton = document.createElement('button');
                            closeButton.textContent = 'Cancel';
                            closeButton.style.padding = '10px 20px';
                            closeButton.style.backgroundColor = '#ff5e57';
                            closeButton.style.color = 'white';
                            closeButton.style.border = 'none';
                            closeButton.style.cursor = 'pointer';
                            closeButton.style.borderRadius = '5px';
                            closeButton.style.transition = 'background-color 0.3s';
                            closeButton.style.display = 'block';
                            closeButton.style.marginTop = '10px';
                            closeButton.style.marginLeft = '10px';
                            buttonsDiv.appendChild(closeButton);

                            closeButton.addEventListener('mouseenter', function() {
                                this.style.backgroundColor = '#ff3832';
                            });

                            closeButton.addEventListener('mouseleave', function() {
                                this.style.backgroundColor = '#ff5e57';
                            });

                            closeButton.onclick = function() {
                                popup.remove();
                            }
                        };

                        // Add the full auto reboot button to the right of the dropdown
                        //actionsDropdown.before(fullAutoRebootButton);
                        
                        // Create a 'getPlannerCardData' button to the right of the dropdown
                        const updatePlannerCardsDropdown = document.createElement('div');
                        updatePlannerCardsDropdown.classList.add('op-dropdown');
                        updatePlannerCardsDropdown.style.display = 'inline-block';
                        updatePlannerCardsDropdown.innerHTML = `
                            <button id="btnNewAction" type="button" class="m-button" onclick="issues.toggleDropdownMenu('updatePlannerCardsDropdown'); return false;">
                                Refresh Planner Cards
                                <m-icon name="chevron-down" class="button-caret-down" data-dashlane-shadowhost="true" data-dashlane-observed="true"></m-icon>
                            </button>
                            <div id="updatePlannerCardsDropdown" class="m-dropdown-menu is-position-right" aria-hidden="true">
                                <div class="m-menu">
                                    <div class="m-menu-item" onclick="getPlannerCardData()">
                                        Retrieve Planner Cards Data
                                    </div>
                                    <div class="m-menu-item" onclick="openPlannerCardDataConfig()">
                                        Edit Config
                                    </div>
                                </div>
                            </div>
                        `;

                        // Add the update planner cards button to the right of the dropdown
                        actionsDropdown.before(updatePlannerCardsDropdown);

                        let plannerCardRefreshInterval;
                        let firstLoad = true;
                        function setUpPlannerCardRefresh() {
                            const plannerCardConfig = GM_SuperValue.get('plannerCardConfig', {autoRetrieve: false, openOnLoad: false, retrieveInterval: 60});
                            
                            // If first load and openOnLoad is enabled, open the planner cards
                            if(firstLoad && plannerCardConfig.openOnLoad) {
                                getPlannerCardData();
                                firstLoad = false;
                            }

                            // Disable the refresh interval if it exists
                            if(plannerCardRefreshInterval) {
                                clearInterval(plannerCardRefreshInterval);
                            }
                            
                            // If the autoRetrieve is enabled, set the interval to refresh the planner cards
                            if(plannerCardConfig.autoRetrieve) {
                                plannerCardRefreshInterval = setInterval(() => {
                                    getPlannerCardData();
                                }, plannerCardConfig.retrieveInterval * 60 * 1000);
                            }
                        }

                        openPlannerCardDataConfig = function() {
                            // Open a small overlay menu for editing if the user wants auto retrieval of planner data and how often
                            const popup = document.createElement('div');
                            popup.style.cssText = `
                                position: fixed;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                                background-color: rgba(0, 0, 0, 0.5);
                                z-index: 1000;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                            `;
                            document.body.appendChild(popup);

                            const popupContent = document.createElement('div');
                            popupContent.style.cssText = `
                                padding: 20px;
                                background-color: #333;
                                border-radius: 10px;
                            `;
                            popup.appendChild(popupContent);

                            const popupTitle = document.createElement('h2');
                            popupTitle.textContent = 'Planner Card Data Config';
                            popupTitle.style.color = 'white';
                            popupTitle.style.marginBottom = '10px';
                            popupContent.appendChild(popupTitle);

                            const plannerCardConfig = GM_SuperValue.get('plannerCardConfig', {autoRetrieve: false, openOnLoad: false, retrieveInterval: 60});
                            
                            // Auto retrieve checkbox
                            const autoRetrieveContainer = document.createElement('div');
                            autoRetrieveContainer.style.display = 'flex';
                            autoRetrieveContainer.style.alignItems = 'center';

                            const autoRetrieveCheckbox = document.createElement('input');
                            autoRetrieveCheckbox.type = 'checkbox';
                            autoRetrieveCheckbox.checked = plannerCardConfig.autoRetrieve;
                            autoRetrieveCheckbox.style.marginBottom = '10px';
                            autoRetrieveCheckbox.style.width = '20px'; // Set the width smaller
                            autoRetrieveCheckbox.style.height = '20px'; // Set the height smaller
                            autoRetrieveCheckbox.style.marginRight = '10px'; // Add some space to the right

                            const autoRetrieveLabelText = document.createElement('span');
                            autoRetrieveLabelText.innerText = 'Auto Retrieve';
                            autoRetrieveLabelText.style.color = '#fff'; // Set text color to white for better contrast
                            autoRetrieveLabelText.style.marginBottom = '10px';

                            autoRetrieveContainer.appendChild(autoRetrieveCheckbox);
                            autoRetrieveContainer.appendChild(autoRetrieveLabelText);
                            popupContent.appendChild(autoRetrieveContainer);

                            // Open on load checkbox
                            const openOnLoadContainer = document.createElement('div');
                            openOnLoadContainer.style.display = 'flex';
                            openOnLoadContainer.style.alignItems = 'center';

                            const openOnLoadCheckbox = document.createElement('input');
                            openOnLoadCheckbox.type = 'checkbox';
                            openOnLoadCheckbox.checked = plannerCardConfig.openOnLoad;
                            openOnLoadCheckbox.style.marginBottom = '10px';
                            openOnLoadCheckbox.style.width = '20px'; // Set the width smaller
                            openOnLoadCheckbox.style.height = '20px'; // Set the height smaller
                            openOnLoadCheckbox.style.marginRight = '10px'; // Add some space to the right

                            const openOnLoadLabelText = document.createElement('span');
                            openOnLoadLabelText.innerText = 'Open on Load';
                            openOnLoadLabelText.style.color = '#fff'; // Set text color to white for better contrast
                            openOnLoadLabelText.style.marginBottom = '10px';

                            openOnLoadContainer.appendChild(openOnLoadCheckbox);
                            openOnLoadContainer.appendChild(openOnLoadLabelText);
                            popupContent.appendChild(openOnLoadContainer);

                            // Retrieve interval input
                            const retrieveIntervalLabel = document.createElement('label');
                            retrieveIntervalLabel.textContent = 'Retrieve Interval (minutes)';
                            retrieveIntervalLabel.style.color = 'white';
                            retrieveIntervalLabel.style.marginBottom = '10px';
                            popupContent.appendChild(retrieveIntervalLabel);
                            
                            const retrieveIntervalInput = document.createElement('input');
                            retrieveIntervalInput.type = 'number';
                            retrieveIntervalInput.min = 1;
                            retrieveIntervalInput.value = plannerCardConfig.retrieveInterval;
                            retrieveIntervalInput.style.width = '100%';
                            retrieveIntervalInput.style.padding = '10px';
                            retrieveIntervalInput.style.marginBottom = '10px';
                            retrieveIntervalInput.style.color = 'white';
                            popupContent.appendChild(retrieveIntervalInput);

                            const buttonsDiv = document.createElement('div');
                            buttonsDiv.style.display = 'flex';
                            buttonsDiv.style.justifyContent = 'space-between';
                            popupContent.appendChild(buttonsDiv);
                            
                            const submitButton = document.createElement('button');
                            submitButton.textContent = 'Save';
                            submitButton.style.padding = '10px 20px';
                            submitButton.style.backgroundColor = '#4CAF50';
                            submitButton.style.color = 'white';
                            submitButton.style.border = 'none';
                            submitButton.style.cursor = 'pointer';
                            submitButton.style.borderRadius = '5px';
                            submitButton.style.transition = 'background-color 0.3s';
                            submitButton.style.display = 'block';
                            submitButton.style.marginTop = '10px';
                            buttonsDiv.appendChild(submitButton);

                            submitButton.addEventListener('mouseenter', function() {
                                this.style.backgroundColor = '#45a049';
                            });

                            submitButton.addEventListener('mouseleave', function() {
                                this.style.backgroundColor = '#4CAF50';
                            });

                            submitButton.onclick = function() {
                                const autoRetrieve = autoRetrieveCheckbox.checked;
                                const openOnLoad = openOnLoadCheckbox.checked;
                                const retrieveInterval = retrieveIntervalInput.value;
                                GM_SuperValue.set('plannerCardConfig', {autoRetrieve: autoRetrieve, openOnLoad: openOnLoad, retrieveInterval: retrieveInterval});
                                popup.remove();

                                setUpPlannerCardRefresh();
                                updatePlannerCardsData();
                            }

                            const closeButton = document.createElement('button');
                            closeButton.textContent = 'Cancel';
                            closeButton.style.padding = '10px 20px';
                            closeButton.style.backgroundColor = '#ff5e57';
                            closeButton.style.color = 'white';
                            closeButton.style.border = 'none';
                            closeButton.style.cursor = 'pointer';
                            closeButton.style.borderRadius = '5px';
                            closeButton.style.transition = 'background-color 0.3s';
                            closeButton.style.display = 'block';
                            closeButton.style.marginTop = '10px';
                            closeButton.style.marginLeft = '10px';
                            buttonsDiv.appendChild(closeButton);

                            closeButton.addEventListener('mouseenter', function() {
                                this.style.backgroundColor = '#ff3832';
                            });

                            closeButton.addEventListener('mouseleave', function() {
                                this.style.backgroundColor = '#ff5e57';
                            });

                            closeButton.onclick = function() {
                                popup.remove();
                            }
                        }
                        
                        setUpPlannerCardRefresh();
                        
                    }

                    function DetectFrozenMiners() {
                        if(disableFrozenMiners) { return; }
                        console.log("Checking for frozen miners...");
                        if(Object.keys(gotFrozenDataFor).length > 0) {
                            activeMiners = 0;
                            foundActiveMiners = false;
                            gotFrozenData = false;
                            gotFrozenDataFor = {};
                        }
                        updateAllMinersData(true, (data) => {
                            setTimeout(() => {
                                DetectFrozenMiners();
                            }, 15000);
                        });
                    }

                    setTimeout(function() {
                        DetectFrozenMiners();
                    }, 2500);

                    // Overide tab toggle function to add in my custom fuctionality
                    function toggleCustomTab(tab) {
                        
                        // show the miner-filters
                        const filterElement = document.querySelector(".filters-section.m-section");
                        const selectedElement = document.querySelector(".miners-selected");
                        if(filterElement) {
                            filterElement.style.display = "block";
                        }
                        if(selectedElement) {
                            selectedElement.style.display = "block";
                        }

                        // Remove popupResultElement if it exists
                        const popupResultElement = document.getElementById('popupResultElement');
                        if (popupResultElement) {
                            popupResultElement.remove();
                        }
                        
                        // Removes the normal table if it exists
                        $(tab).addClass("selected");
                        $(tab).siblings(".tab").removeClass("selected");
                        $(".all-panel, .error-panel").removeClass("active");

                        if(tab.custom) {
                            // Hide miner-filters
                            if (filterElement) {
                                filterElement.style.display = "none";
                            }
                            if (selectedElement) {
                                selectedElement.style.display = "none";
                            }
                        }

                        if(tab.id === "frozenMiners") {
                            // Create frozen miners table and add to #grid-wrapper
                            const cols = ['IP', 'Miner', 'Last Reported Uptime', 'Slot ID & Breaker', 'Serial Number'];
                            const gridWrapper = document.getElementById('grid-wrapper');
                            createPopUpTable(`Possible Frozen Miners List`, cols, gridWrapper, (popupResultElement) => {
                                const firstDiv = popupResultElement.querySelector('div');
                                const containerDiv = document.createElement('div');
                                containerDiv.style.cssText = `
                                    display: flex;
                                    gap: 10px;
                                    padding: 0px;
                                    background-color: #444947;
                                    border-radius: 10px;
                                    margin-top: 10px;
                                    align-self: flex-start;
                                `;

                                const checkedMinersText = document.createElement('div');
                                checkedMinersText.style.cssText = `
                                    padding: 5px;
                                    background-color: #444947;
                                    border-radius: 5px;
                                    font-size: 0.8em;
                                `;
                                checkedMinersText.textContent = `Miners Checked: Detecting...`;

                                // Update the checked miners text
                                setInterval(() => {
                                    if(foundActiveMiners && Object.keys(gotFrozenDataFor).length > 0) {
                                        checkedMinersText.textContent = `Miners Checked: ${Object.keys(gotFrozenDataFor).length}/${activeMiners}`;
                                    } else if(checkedMinersText.textContent !== 'Miners Checked: Detecting...') {
                                        checkedMinersText.textContent = `Miners Checked: Re-Detecting...`;
                                    }
                                }, 500);

                                const additionalNote = document.createElement('div');
                                additionalNote.style.cssText = `
                                    padding: 5px;
                                    background-color: #444947;
                                    border-radius: 5px;
                                    font-size: 0.8em;
                                `;
                                additionalNote.textContent = `Note: This list may not be 100% accurate. It can also take upwards of a few minutes to get the required data.`;

                                containerDiv.appendChild(checkedMinersText);
                                containerDiv.appendChild(additionalNote);
                                firstDiv.appendChild(containerDiv);

                                // Add the miner data to the table body
                                const popupTableBody = popupResultElement.querySelector('tbody');
                                // Loop through frozenMiners
                                frozenMiners.forEach(currentMiner => {
                                    const minerID = currentMiner.id;
                                    const minerLink = `https://foundryoptifleet.com/Content/Miners/IndividualMiner?id=${minerID}`;
                                    const minerIP = currentMiner.ipAddress;
                                    const row = document.createElement('tr');
                                    const model = currentMiner.modelName;
                                    const uptime = currentMiner.uptime;
                                    let slotID = currentMiner.locationName;

                                    var splitSlotID = slotID.split('-');
                                    var containerID = splitSlotID[0].split('_')[1];
                                    var rackNum = Number(splitSlotID[1]);
                                    var rowNum = Number(splitSlotID[2]);
                                    var colNum = Number(splitSlotID[3]);
                                    var rowWidth = 4;
                                    var breakerNum = (rowNum-1)*rowWidth + colNum;

                                    // Remakes the slot ID, but with added 0 padding
                                    let reconstructedSlotID = `${containerID}-${rackNum.toString().padStart(2, '0')}-${rowNum.toString().padStart(2, '0')}-${colNum.toString().padStart(2, '0')}`;

                                    // Adds together the slot ID and breaker number, where the breaker number is padded with spaces
                                    let paddedSlotIDBreaker = `${reconstructedSlotID}  [${breakerNum.toString().padStart(2, '0')}]`;

                                    const minerSerialNumber = currentMiner.serialNumber;
                                    row.innerHTML = `
                                        <td style="text-align: left;"><a href="http://${currentMiner.username}:${currentMiner.passwd}@${minerIP}/" target="_blank" style="color: white;">${minerIP}</a></td>
                                        <td style="text-align: left;"><a href="${minerLink}" target="_blank" style="color: white;">${model}</a></td>
                                        <td style="text-align: left;">${uptime}</td>
                                        <td style="text-align: left;">${paddedSlotIDBreaker}</a></td>
                                        <td style="text-align: left;">${minerSerialNumber}</td>
                                    `;
                                    popupTableBody.appendChild(row);
                                });

                                document.title = orginalTitle;

                                // Ensure jQuery, DataTables, and ColResize are loaded before initializing the table
                                $(document).ready(function() {
                                    // Custom sorting function for slot IDs
                                    $.fn.dataTable.ext.type.order['miner-id'] = function(d) {
                                        // Split something "C05-10-3-4" into an array of just the numbers that aren't seperated by anything at all
                                        let numbers = d.match(/\d+/g).map(Number);
                                        //numbers.shift(); // Remove the first number since it is the miner ID
                                        // Convert the array of numbers into a single comparable value
                                        // For example, [10, 3, 4] becomes 100304
                                        let comparableValue = numbers.reduce((acc, num) => acc * 1000 + num, 0);
                                        return comparableValue;
                                    };
                                    

                                    $('#minerTable').DataTable({
                                        paging: false,       // Disable pagination
                                        searching: false,    // Disable searching
                                        info: false,         // Disable table info
                                        columnReorder: true, // Enable column reordering
                                        responsive: true,    // Enable responsive behavior
                                        colResize: true,      // Enable column resizing

                                        // Use custom sorting for the "Slot ID" column
                                        columnDefs: [
                                            {
                                                targets: $('#minerTable th').filter(function() {
                                                    return $(this).text().trim() === 'Slot ID';
                                                }).index(),
                                                type: 'miner-id'  // Apply the custom sorting function
                                            }
                                        ]
                                    });

                                    $('#minerTable').DataTable().draw();
                                });
                            });
                        }
                    }

                    // Add new tab
                    const tabsContainer = document.querySelector('.tabs');
                    if (tabsContainer && !disableFrozenMiners) {
                        const frozenMinersTab = document.createElement('div');
                        frozenMinersTab.id = 'frozenMiners';
                        frozenMinersTab.custom = true;
                        frozenMinersTab.className = 'tab';
                        frozenMinersTab.onclick = function() {
                        };
                        frozenMinersTab.innerHTML = `
                            <span>Frozen Miners</span>
                            <span class="m-chip new-tab-count">?</span>
                        `;
                        // Update the count of the new tab to the length of frozenMiners
                        let lastFreezeCount = 0;
                        setInterval(() => {
                            const count = frozenMiners.length;
                            if (!gotFrozenData && count === 0) {
                                //frozenMinersTab.querySelector('.new-tab-count').textContent = "?";
                                return;
                            }
                            frozenMinersTab.querySelector('.new-tab-count').textContent = count;
                            if (count !== lastFreezeCount && frozenMinersTab.classList.contains('selected')) {
                                lastFreezeCount = count;
                                frozenMinersTab.click();
                            }
                        }, 100);

                        // Align to right
                        /*
                        frozenMinersTab.style.cssText = `
                            margin-left: auto;
                            position: relative;
                            right: 2px;
                        `;*/
                        frozenMinersTab.style.cssText = `
                            margin-left: auto;
                            margin-right: 0px;
                        `;
                        tabsContainer.appendChild(frozenMinersTab);
                    }

                    // Loop through all the tabs and add an extra on click event 
                    const tabs = document.querySelectorAll('.tab');
                    tabs.forEach(tab => {
                        tab.onclick = function() {
                            toggleCustomTab(this);
                            if(!this.custom) {
                                issues.toggleTab(this);
                            }
                        };
                    });
                }

            }, 1000);
        }
        
        // Individual Miner Page added data boxes
        if(currentUrl.includes("https://foundryoptifleet.com/Content/Miners/IndividualMiner")) {

            function addDataBox(title, data, updateFunc, updateInterval) {
                // Add new m-box to m-grid-list
                const mGridList = document.querySelector('.m-grid-list');
                const mBox = document.createElement('div');
                mBox.classList.add('m-box');
                mGridList.appendChild(mBox);

                // Add new m-stack to m-box
                const mStack = document.createElement('div');
                mStack.classList.add('m-stack');
                mStack.classList.add('has-space-s');
                mBox.appendChild(mStack);

                // Add new h3 to m-stack
                const h3 = document.createElement('h3');
                h3.classList.add('m-heading');
                h3.classList.add('is-muted');
                h3.textContent = title;
                mStack.appendChild(h3);

                // Add new p to m-stack
                const p = document.createElement('p');
                p.classList.add('m-code');
                p.classList.add('is-size-xl');
                p.textContent = data;
                mStack.appendChild(p);

                // Run the update function if it exists
                if (updateFunc) {
                    updateFunc(mBox, h3, p);
                    if (updateInterval) {
                        setInterval(() => {
                            updateFunc(mBox, h3, p);
                        }, updateInterval);
                    }
                }

                // Return the m-box element
                return mBox;
            }

            const minerID = currentUrl.match(/id=(\d+)/)[1];
            function parsePathData(d) {
                const commands = d.match(/[a-zA-Z][^a-zA-Z]*/g);
                let currentY = 0;
                let topY = Number.POSITIVE_INFINITY;
                let bottomY = Number.NEGATIVE_INFINITY;
                let downCounts = 0;
                let upCounts = 0;
                let lastY;

                commands.forEach(command => {
                    const type = command[0];
                    const values = command.slice(1).trim().split(/[\s,]+/).map(Number);
                    switch (type) {
                        case 'M':
                        case 'L':
                            currentY = values[1];
                            break;
                        case 'C':
                            currentY = values[5];
                            break;
                    }

                    if(currentY !== lastY) {
                        if(currentY > 0) { // Height changes, anything above 0 should always been it is down, since it is a binary on/off and I know 0 has to be on.
                            downCounts++;
                        }
                        if(currentY === 0) {
                            upCounts++;
                        }
                    }
                    lastY = currentY;
                });

                return { downCounts, upCounts };
            }

            function getGraphData(chart) {
                const path = chart.querySelector('[id^="SvgjsPath"]');
                const d = path.getAttribute('d');
                return parsePathData(d);
            }

            function createChartDataBox(chartID, title, callback) {
                const chart = document.querySelector(chartID);
                if (!chart) {
                    setTimeout(() => {
                        createChartDataBox(chartID, title, callback);
                    }, 500);
                    return;
                }
                var lastChartd = '';
                var downCountBox;
                const observer = new MutationObserver(() => {
                    const path = chart.querySelector('[id^="SvgjsPath"]');
                    if (path) {
                        const d = path.getAttribute('d');

                        // Check if the d attribute has changed
                        if (d === lastChartd) {
                            return;
                        }
                        lastChartd = d;
                        const result = getGraphData(chart);

                        // Check if reportRange.textContent changes
                        const reportRange = document.getElementById('reportrange');
                        const timeSpan = reportRange.textContent.trim();

                        // Find the existing data box
                        if (downCountBox) {
                            // Update the range in the box
                            const h3 = downCountBox.querySelector('h3');
                            if (h3) {
                                h3.textContent = `${title} (${timeSpan})`;
                            }

                            // Update the down times count
                            const p = downCountBox.querySelector('p');
                            if (p) {
                                p.textContent = result.downCounts;
                            }
                        } else {
                            // Add the new data box to the page
                            downCountBox = addDataBox(`${title} (${timeSpan})`, result.downCounts);
                        }

                        if(callback && typeof callback === 'function') {
                            callback(result, timeSpan);
                        }


                    }
                });

                observer.observe(chart, {
                    childList: true,
                    subtree: true
                });
            }

            createChartDataBox('#uptimeChart', 'Times Down', (result, timeSpan) => {
            });


            // Wait for the miner activity list to exist and be fully loaded
            const waitForMinerActivityList = setInterval(() => {
                const minerActivityList = document.getElementById('miner-activity-list-IndividualMiner');
                const activityRows = minerActivityList.querySelectorAll('.m-table-row');
                const noActivityElement = document.querySelector('.no-activity-section.active');
                const errorCount = GM_SuperValue.get("errorCount", 0);
                const pastMaxErrors = errorCount > 3;
                if (minerActivityList && (activityRows && activityRows.length > 0) || noActivityElement || pastMaxErrors) {

                    clearInterval(waitForMinerActivityList);

                    var lastRebootTime;
                    const reboots = [];
                    if(!pastMaxErrors) {
                        // Loop through the activity list and find the reboots
                        activityRows.forEach(row => {
                            const cell = row.querySelector('.m-table-cell');
                            if (cell.textContent.includes('reboot initiated')) {
                                reboots.push(cell.textContent);

                                if(!lastRebootTime) {
                                    const time = cell.textContent.match(/(\d{1,2}:\d{1,2}:\d{1,2} [AP]M)/);
                                    const date = cell.textContent.match(/(\d{1,2}\/\d{1,2}\/\d{2,4})/);
                                    lastRebootTime = new Date(date[0] + ' ' + time[0]);
                                }
                            }
                        });
                    } else {
                        //'Error';
                    }

                    // Add the reboot count to the page
                    addDataBox('Reboot Count (Activity Log)', reboots.length);

                    // Time since last reboot
                    if(lastRebootTime) {
                        const timeSinceReboot = Date.now() - lastRebootTime;
                        const timeSinceRebootElement = addDataBox('Time Since Last Reboot (Activity Log)', timeSinceReboot, (mBox, h3, p) => {
                            let timeSinceReboot = Date.now() - lastRebootTime;
                            const days = Math.floor(timeSinceReboot / (1000 * 60 * 60 * 24));
                            timeSinceReboot = new Date(timeSinceReboot).toISOString().substr(11, 8);
                            if (days > 0) {
                                timeSinceReboot = days + 'd ' + timeSinceReboot;
                            }
                            p.textContent = timeSinceReboot;
                        }, 1000);
                    }
                }
            }, 500);

            function createBreakerNumBox() {
                // Check if the details were loaded
                var detailsLoadedInterval = setInterval(() => {
                    var [cleanedText, minerDetails] = getMinerDetails();

                    // Make sure this is a minden miner
                    var locationID = minerDetails['locationID'];
                    if (!locationID.includes('Minden')) {
                        return;
                    }

                    var splitLocationID = locationID.split('-');
                    var row = Number(splitLocationID[2]);
                    var col = Number(splitLocationID[3]);
                    var rowWidth = 4;
                    var breakerNum = (row-1)*rowWidth + col;
                    if (row > 0 && col > 0) {
                        clearInterval(detailsLoadedInterval);
                        addDataBox("Breaker Number", breakerNum);
                    }
                }, 500);
            }
            createBreakerNumBox();

            //----------------------------------------------------------
            
            // Logic for seeing if the miner exists in a planner board
            function checkIfInPlannerBoard() {
                GM_SuperValue.set("locatePlannerCard", false);

                var [cleanedText, minerDetails] = getMinerDetails();
                console.log(minerDetails);
                if(!minerDetails || !minerDetails['serialNumber'] || minerDetails['serialNumber'] == "--") {
                    setTimeout(checkIfInPlannerBoard, 500);
                    return;
                }

                var serialNumber = minerDetails['serialNumber'];
                
                // Cycle 3 dots
                let cycle = 0;
                let dots = "";

                // Add a data box that will be updated with the GM_SuperValue of plannerCardsData
                let plannerDataBox = addDataBox("Planner Board", "Loading...", (mBox, h3, p) => {
                    // Put h3 as a div, then add a 'refresh' button to the right of it, if we haven't already
                    if(!mBox.querySelector('.refresh-button-container')) {
                        const div = document.createElement('div');
                        div.classList.add('refresh-button-container');
                        div.style.cssText = `
                            display: flex;
                            justify-content: space-between;
                        `;
                        h3.style.display = 'inline-block';
                        div.appendChild(h3);

                        const refreshButton = document.createElement('button');
                        refreshButton.textContent = 'Refresh';
                        refreshButton.style.padding = '5px 5px';
                        refreshButton.style.backgroundColor = '#0078d4';
                        refreshButton.style.color = 'white';
                        refreshButton.style.border = 'none';
                        refreshButton.style.cursor = 'pointer';
                        refreshButton.style.borderRadius = '5px';
                        refreshButton.style.transition = 'background-color 0.3s';
                        refreshButton.style.display = 'block';
                        refreshButton.style.marginTop = '0px';
                        refreshButton.style.marginRight = '0px';
                        div.appendChild(refreshButton);

                        refreshButton.addEventListener('mouseenter', function() {
                            this.style.backgroundColor = '#005a9e';
                        });

                        refreshButton.addEventListener('mouseleave', function() {
                            this.style.backgroundColor = '#0078d4';
                        });

                        refreshButton.onclick = function() {
                            event.preventDefault();
                            getPlannerCardData();
                        }

                        mBox.insertBefore(div, mBox.firstChild);
                    }

                    // Dots cycle logic
                    cycle++;
                    if(cycle > 3) {
                        cycle = 0;
                        dots = "";
                    } else {
                        dots += ".";
                    }

                    // Check if the data has been found/displays the data
                    let plannerCardsDataAll = {};
                    for(var key in urlLookupPlanner) {
                        let plannerID = getPlannerID(urlLookupPlanner[key]) //.match(/plan\/([^?]+)/)[1].split('/')[0];
                        let collectDataSuperValueID = "plannerCardsData_" + plannerID;
                        let data = GM_SuperValue.get(collectDataSuperValueID, {});
                        // combine into plannerCardsData
                        plannerCardsDataAll = {...plannerCardsDataAll, ...data};
                    }

                    let cardData = plannerCardsDataAll[serialNumber];
                    if(cardData) {
                        p.textContent = cardData.columnTitle;

                        // Make it a clickable link
                        p.style.cursor = 'pointer';
                        p.onclick = function() {
                            GM_SuperValue.set("locatePlannerCard", {
                                serialNumber: serialNumber,
                                columnTitle: p.textContent
                            });

                            var url = cardData.url;
                            window.open(url, '_blank');
                        }

                        // Make it blue and underlined
                        p.style.color = '#0078d4';
                        p.style.textDecoration = 'underline';
                    } else {
                        // Make it not clickable
                        p.style.cursor = 'default';
                        p.style.color = 'white';
                        p.style.textDecoration = 'none';
                        p.textContent = "[Not Found]";

                        // Add subtext if it doesn't exist already
                        if(!mBox.querySelector('p')) {
                            const subText = document.createElement('p');
                            subText.textContent = "This isn't 100% accurate, it can take a bit to update.";
                            subText.style.color = '#70707b';
                            subText.style.fontSize = '0.8em';
                            subText.style.marginTop = '5px';
                            mBox.appendChild(subText);
                        }
                    }

                    // add sub text to tell the user that this might need refreshed if cards changed
                    if(!mBox.querySelector('.refresh-text')) {
                        const refreshText = document.createElement('p');
                        refreshText.classList.add('refresh-text');
                        refreshText.textContent = 'This might need refreshed if cards changed.';
                        refreshText.style.color = '#70707b';
                        refreshText.style.fontSize = '0.8em';
                        refreshText.style.marginTop = '5px';
                        mBox.appendChild(refreshText);
                    }
                }, 1000);
                
            }
            checkIfInPlannerBoard();
            
        }
        
        // Miner Map/List, add temperature data
        if(currentUrl.includes("https://foundryoptifleet.com/Content/Dashboard/Miners/Map") || currentUrl.includes("https://foundryoptifleet.com/Content/Dashboard/Miners/List")) {
            function addDataBox(title, data, updateFunc, updateInterval) {
                // Add new m-box to m-grid-list
                const mGridList = document.querySelector('.m-grid-list');
                const mBox = document.createElement('div');
                mBox.classList.add('m-box');
                mGridList.appendChild(mBox);

                // Add new m-stack to m-box
                const mStack = document.createElement('div');
                mStack.classList.add('m-stack');
                mStack.classList.add('has-space-s');
                mBox.appendChild(mStack);

                // Add new h3 to m-stack
                const h3 = document.createElement('h3');
                h3.classList.add('m-heading');
                h3.classList.add('is-muted');
                h3.textContent = title;
                h3.style.color = '#70707b';
                mStack.appendChild(h3);

                // Add new p to m-stack
                const p = document.createElement('p');
                p.classList.add('m-code');
                p.classList.add('is-size-xl');
                p.textContent = data;
                mStack.appendChild(p);

                // Run the update function if it exists
                if (updateFunc) {
                    updateFunc(mBox, h3, p);
                    if (updateInterval) {
                        setInterval(() => {
                            updateFunc(mBox, h3, p);
                        }, updateInterval);
                    }
                }

                // Return the m-box element
                return mBox;
            }

            let lastContainer = "";
            let currentTempBox = null;
            function CreateTemperatureDataBox() {
                currentTempBox = addDataBox("Temperature", "Loading...", (mBox, h3, p) => {
                    if (mBox) {
                        retrieveContainerTempData((containerTempData) => {
                            var containerElement = document.querySelector('#zoneList');
                            if (containerElement) {
                                const shadowRoot = containerElement.shadowRoot;
                                const selectedOption = shadowRoot.querySelector('option[selected]');
                                const containerText = selectedOption.textContent.trim();
                                // Make sure we in the minden site
                                if(containerText !== "zones" && !containerText.includes('Minden')) {
                                    mBox.style.display = 'none';
                                    return;
                                } else {
                                    mBox.style.display = 'block';
                                }
                                try {
                                    const containerNum = parseInt(containerText.split('_')[1].substring(1), 10); // Extract the number after 'C' and remove leading zeros
                                    if (isNaN(containerNum) || !containerTempData[containerNum]) {
                                        throw new Error('Invalid container number or missing temperature data');
                                    }
                                    const tempValue = containerTempData[containerNum].temp.toFixed(2);
                                    p.textContent = tempValue;
                                } catch (error) {
                                    console.error('Error retrieving temperature data:', error);
                                    p.textContent = '';
                                }
                            } else {
                                p.textContent = '';
                            }
                        } );
                    }
                }, 1000);
            }

            // Add observer to detect when the container changes via #zoneList
            const observer = new MutationObserver((mutationsList, observer) => {
                var containerElement = document.querySelector('#zoneList');
                if (containerElement) {
                    const shadowRoot = containerElement.shadowRoot;
                    const selectedOption = shadowRoot.querySelector('option[selected]');
                    const containerText = selectedOption.textContent.trim();
                    if (containerText !== lastContainer) {
                        lastContainer = containerText;
                        if(currentTempBox) {
                            currentTempBox.remove();
                        }
                        CreateTemperatureDataBox();
                    }
                }
            });

            // Start observing the container
            observer.observe(document.body, { childList: true, subtree: true });
        }

        // Add temps for all containers if in overview page and are in minden
        if(currentUrl.includes("https://foundryoptifleet.com/Content/Dashboard/SiteOverview") && siteName.includes("Minden")) {
            let lastRan = 0;
            function addTemperatureData() {
                const containers = document.querySelectorAll('.stat-panel.good');
                if (containers.length === 0) {
                    setTimeout(addTemperatureData, 10);
                    return;
                }

                containers.forEach(container => {
                    // Add the temperature title if it doesn't exist
                    if (!container.querySelector('.temp-text-title')) {
                        const tempElement = document.createElement('div');
                        tempElement.className = 'temp-text-title';
                        tempElement.innerText = 'Temperature:';
                        // set the color to a light orange
                        tempElement.style.color = '#ff7f50';
                        container.appendChild(tempElement);
                    }
                });

                function getTemp() {
                    if (Date.now() - lastRan < 5000) {
                        return;
                    }
                    lastRan = Date.now();
                    retrieveContainerTempData((containerTempData) => {
                        containers.forEach(container => {
                            const containerNum = parseInt(container.querySelector('.m-heading').innerText.split('_')[1].substring(1));
                            if (isNaN(containerNum) || !containerTempData[containerNum]) {
                                return;
                            }
                            const tempValue = containerTempData[containerNum].temp.toFixed(2);
                            let tempElement = container.querySelector('.temp-text');
                            if(!tempElement) {
                                tempElement = document.createElement('div');
                                tempElement.className = 'temp-text';
                                container.appendChild(tempElement);
                            }
                            tempElement.innerText = tempValue + '°F';
                            if (tempValue > 80) {
                                tempElement.style.color = 'red';
                                tempElement.textContent += ' 🔥';
                            } else if (tempValue > 70) {
                                tempElement.style.color = 'yellow';
                                tempElement.textContent += ' ⚠️';
                            } else if (tempValue <= 25) {
                                tempElement.style.color = '#38a9ff';
                                tempElement.textContent += ' ❄️';
                            } else {
                                tempElement.style.color = 'white';
                            }
                        });
                    });
                }

                getTemp();
            }

            addTemperatureData();
            setInterval(() => {
                addTemperatureData();
            }, 5000);

            // Observer any changes, if 'temp-text-title' is no longer there, then re-add it
            const observer = new MutationObserver((mutationsList, observer) => {
                addTemperatureData();
            });

            // Start observing the container
            observer.observe(document.body, { childList: true, subtree: true });
            
        }
    }

    // Only run on the OptiFleet website
    if(currentUrl.includes("https://foundryoptifleet.com")) {

        OptiFleetSpecificLogic();

        /*
        // Find navMinerMap, and inject a button below it called Test Bench
        const navMinerMap = document.getElementById('navMinerMap');

        const createTestBenchButton = (name, icon, onClick) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.style.display = 'flex';
            button.style.alignItems = 'center';
            button.style.marginTop = '8px';
            button.style.backgroundColor = 'transparent';
            button.style.border = 'none';
            button.style.cursor = 'pointer';
            button.innerHTML = `
                <img src="${icon}" style="width: 24px; height: 24px; margin-right: 8px;">
                <span style="color: white;">${name}</span>
            `;
            button.addEventListener('click', onClick);
            return button;
        };

        // Add <div class="m-divider has-space-m"></div> to separate the buttons
        const divider = document.createElement('div');
        divider.className = 'm-divider has-space-m';
        navMinerMap.after(divider);

        const testBench1 = createTestBenchButton('Test Bench 1', 'https://cdn.discordapp.com/attachments/940214867778998283/1282276373389508608/pngtree-project-management-line-icon-vector-png-image_6738629.png?ex=66dec46e&is=66dd72ee&hm=c3724d9388e5102ad183a0a16b5ce43ce9e9247fb6f5d6d53d4eede483592d4e&', () => {
            // Code for Test Bench 1
        });
        divider.after(testBench1);

        const testBench2 = createTestBenchButton('Test Bench 2', 'https://cdn.discordapp.com/attachments/940214867778998283/1282276373389508608/pngtree-project-management-line-icon-vector-png-image_6738629.png?ex=66dec46e&is=66dd72ee&hm=c3724d9388e5102ad183a0a16b5ce43ce9e9247fb6f5d6d53d4eede483592d4e&', () => {
            // Code for Test Bench 2
        });
        testBench1.after(testBench2);
        */


    }

    if (currentUrl.includes("foundrydigitalllc.sharepoint.com/") ) {
        // If there is a taskName/Notes in storage, then create a overlay on the right side of the page that says Go to Planner
        let taskName = GM_SuperValue.get("taskName", "");
        const detailsData = JSON.parse(GM_SuperValue.get("detailsData", "{}"));
        const minerType = detailsData['type'];

        if (taskName !== "") {
            // If the minerType is contained in the URL, then we probably opened up the right excel sheet
            if(currentUrl.toLowerCase().includes(minerType.toLowerCase())) {
                GM_SuperValue.set('openedExcel', true);
            }

            setTimeout(() => {
                const overlay = document.createElement('div');
                overlay.style.position = 'fixed';
                overlay.style.top = '20px';
                overlay.style.right = '20px';
                overlay.style.backgroundColor = '#f2f2f2';
                overlay.style.padding = '10px';
                overlay.style.borderRadius = '5px';
                overlay.style.color = '#333';
                overlay.style.fontSize = '14px';
                overlay.style.fontWeight = 'bold';
                overlay.style.outline = '2px solid #333'; // Add outline
                let plannerUrl = urlLookupPlanner[detailsData['type']];
                overlay.innerHTML = `
                    <p>Model: ${detailsData['model']}</p>
                    <p>Serial Number: ${detailsData['serialNumber']}</p>
                    <p>Slot ID: ${detailsData['locationID']}</p>
                    <button id="cancelButton" style="background-color: red; color: #fff; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-top: 10px;">
                    Cancel
                    </button>
                `;
                // Make sure it is always layered on top
                overlay.style.zIndex = '9999';
                document.body.appendChild(overlay);

                const cancelButton = document.getElementById('cancelButton');
                cancelButton.addEventListener('click', () => {
                    GM_SuperValue.set('taskName', '');
                    GM_SuperValue.set('taskNotes', '');
                    GM_SuperValue.set('taskComment', '');
                    GM_SuperValue.set('detailsData', {});
                    document.body.removeChild(overlay);

                    // Close the window
                    window.close();
                });

                // -- Find the actual list item in the planner and click it

                // Select the parent element
                const parentElement = document.querySelector('.ms-List-page');

                // Get all inner elements with the specified attributes
                const innerElements = parentElement.querySelectorAll('div[data-is-focusable="true"][role="row"][data-is-draggable="false"][draggable="false"]');

                // Initialize an array to store elements with the required aria-label
                const matchingElements = [];
                var backUpElement = null;

                // Loop through each inner element and check the aria-label
                innerElements.forEach(element => {
                    const ariaLabel = element.getAttribute('aria-label').toLowerCase();
                    if (ariaLabel.includes(minerType.toLowerCase()) && ariaLabel.includes('minden') && ariaLabel.includes('gv')) {
                        // Extract the number between "bitmain" and "minden"
                        const match = ariaLabel.match(new RegExp(`${minerType.toLowerCase()}\\s*(\\d+)\\s*minden`, 'i'));
                        if (match) {
                            const number = parseInt(match[1], 10);
                            matchingElements.push({ element, number });
                        }
                    }

                    if (ariaLabel.includes(minerType.toLowerCase())) {
                        backUpElement = element;
                    }
                });

                // Find the element with the largest number
                let largestElement = null;
                let largestNumber = 0;

                matchingElements.forEach(item => {
                    if (item.number > largestNumber) {
                        largestNumber = item.number;
                        largestElement = item.element;
                    }
                });

                if(largestElement === null) {
                    largestElement = backUpElement;
                }

                // Click the largest element link (find the button with the role 'link')
                const linkButton = largestElement.querySelector('button[role="link"]');
                if (linkButton) {
                    // Scroll to the element
                    linkButton.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    // Highlight the element
                    largestElement.style.backgroundColor = 'yellow';

                    setTimeout(() => {
                        // Instant scroll, in case the smooth scroll didn't make it/got interrupted
                        linkButton.scrollIntoView({ behavior: 'auto', block: 'center' });

                        // Simulate a click on the link button
                        GM_SuperValue.set('openedExcel', false);
                        linkButton.click();
                        

                        // Inteval checking if taskname is empty to close the page
                        const interval = setInterval(() => {
                            let excelOpened = GM_SuperValue.get('openedExcel', false);
                            taskName = GM_SuperValue.get("taskName", "");
                            if (taskName === "" || excelOpened) {
                                GM_SuperValue.set('taskName', '');
                                GM_SuperValue.set('taskNotes', '');
                                GM_SuperValue.set('taskComment', '');
                                GM_SuperValue.set('detailsData', {});
                                window.close();
                            }
                        }, 100);

                        // Simulate a right click and copy the link
                        //linkButton.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }));

                        // Another timer which adds to overlay that it failed to open and that you need to allow 'pop ups'
                        setTimeout(() => {
                            const overlay2 = document.createElement('div');
                            overlay2.style.position = 'fixed';
                            overlay2.style.top = '20px';
                            overlay2.style.right = '20px';
                            overlay2.style.backgroundColor = '#f2f2f2';
                            overlay2.style.padding = '10px';
                            overlay2.style.borderRadius = '5px';
                            overlay2.style.color = '#333';
                            overlay2.style.fontSize = '14px';
                            overlay2.style.fontWeight = 'bold';
                            overlay2.style.outline = '2px solid #333'; // Add outline
                            overlay2.innerHTML = `
                                <p>Failed to open the link.</p>
                                <p>Please set 'Always allow pop-ups and redirects' on this page.</p>
                            `;
                            // Make sure it is always layered on top
                            overlay2.style.zIndex = '9999';
                            document.body.appendChild(overlay2);

                            // Timeout for one tick
                            setTimeout(() => {
                                // Position the old overlay below the new overlay
                                const overlay2Rect = overlay2.getBoundingClientRect();
                                overlay.style.top = `${overlay2Rect.bottom + 20}px`;
                            }, 0);
                        }, 1000);
                    }, 500);
                }
            }, 500);
        }

    } else if (currentUrl.includes("planner.cloud.microsoft")) {

        // Logic for going to and highling the locatePlannerCard GM_SuperValue
        const locatingText = ` [Locating...]`;
        let columnTitleTextElement = null;
        let foundCard = false;
        let notLookingTimes = 0;
        function locatePlannerCard() {
            if (window !== window.top) {
                return;
            }

            if (foundCard || notLookingTimes > 20) {
                return;
            }

            const locatePlannerCardData = GM_SuperValue.get("locatePlannerCard", false);
            if (!locatePlannerCardData) {
                //console.log("No locatePlannerCard Data found.");
                notLookingTimes++;
                setTimeout(() => {
                    locatePlannerCard();
                }, 100);
                return;
            }

            let serialNumber = locatePlannerCardData.serialNumber;
            let columnTitle = locatePlannerCardData.columnTitle;
            let cardCreateCheck = locatePlannerCardData.cardCreateCheck;

            // Find the card with the serial number
            const cards = document.querySelectorAll('.taskCard');
            if (cards.length === 0) {
                setTimeout(() => {
                    locatePlannerCard();
                }, 100);
                return;
            }

            cards.forEach(card => {
                const taskName = card.getAttribute('aria-label');
                if (taskName.includes(serialNumber)) {
                    console.log("Found the card: ", card);

                    // Highlight the card
                    const container = card.querySelector('.container');
                    if (container) {
                        console.log("Found the container: ", container);
                        foundCard = true;

                        // Reset all scrollable elements to the top/left
                        const scrollableElements = document.querySelectorAll('.scrollable');
                        scrollableElements.forEach(element => {
                            element.scrollTop = 0;
                            element.scrollLeft = 0;
                        });

                        // Scroll to the card
                        container.scrollIntoView({ behavior: 'smooth', block: 'center' });

                        // Remove the locating text if it exists
                        if (columnTitleTextElement && columnTitleTextElement.textContent.includes(locatingText)) {
                            columnTitleTextElement.textContent = columnTitleTextElement.textContent.replace(locatingText, '');
                        }

                        // Make the container grey, but then slowly fade it back to the original color
                        container.style.transition = 'background-color 0.8s';
                        container.style.backgroundColor = 'grey';
                        setTimeout(() => {
                            container.style.transition = 'background-color 3s';
                            container.style.backgroundColor = '';
                        }, 2000);

                        // Reset the GM_SuperValue
                        GM_SuperValue.set("locatePlannerCard", false);
                    } else {
                        setTimeout(() => {
                            console.log("Retrying locatePlannerCard");
                            locatePlannerCard();
                        }, 100);
                    }
                } else {

                    if(foundCard) {
                        return;
                    }

                    // Find all scrollable elements and scroll to bottom if it is the right column
                    let foundColumn = false;
                    const scrollableElements = document.querySelectorAll('.scrollable');
                    scrollableElements.forEach(element => {
                        // Get parent and see if columnTitle is contained in aria-label
                        const parent = element.parentElement;
                        const columnTitleElement = parent.querySelector('.columnTitle');
                        if(columnTitleElement) {
                            let columnTitleTextElementTemp = columnTitleElement.querySelector('h3');
                            if (columnTitleTextElementTemp && columnTitleTextElementTemp.textContent.includes(columnTitle)) {
                                columnTitleTextElement = columnTitleTextElementTemp;

                                // Then scroll to the bottom of the element
                                element.scrollTop = element.scrollTop + 10;
                                console.log("Scrolling to bottom of column: ", element);
                                foundColumn = true;

                                // Set the text to be its name with " [Locating...]" added onto it, so long as it doesn't already have it
                                if (!columnTitleTextElementTemp.textContent.includes(locatingText)) {
                                    columnTitleTextElementTemp.textContent = `${columnTitleTextElementTemp.textContent}${locatingText}`;
                                }
                            }
                        }
                    });
                    
                    if (!foundColumn) {
                        // Scroll horizontally all the way to the right on columnsList 
                        const columnsList = document.querySelector('.columnsList');
                        columnsList.scrollLeft = columnsList.scrollLeft + 10;
                    }

                    setTimeout(locatePlannerCard, 100);
                    return;
                }
            });
        }
        setTimeout(locatePlannerCard, 800);

        // Logic for looping through all the planner cards, and saving the miner serial number and the category it is in, so we can use it in optifleet
        let lastGotTime = Date.now();
        let setDate = false;
        let plannerID = getPlannerID(currentUrl); //.match(/plan\/([^?]+)/)[1].split('/')[0];
        let newPlannerData = {};
        let collectIndex = 1;
        function collectPlannerCardData() {
            // Check if this window is actually a iframe
            if (window === window.top) {
                return;
            }

            // If last gottime is more than 3 seconds, close the window
            if (Date.now() - lastGotTime > 3000) {
                console.log("Closing window because probably at end of planner cards.");
                GM_SuperValue.set("plannerCardsClosePage_"+plannerID, true);
                GM_SuperValue.get("plannerCardsData_" + plannerID, newPlannerData);
                return;
            }

            if (!setDate) {
                GM_SuperValue.set("plannerPageLoaded_"+plannerID, true);
                GM_SuperValue.set('plannerCardsDataTime', Date.now());
                setDate = true;
            }

            // Get the grid-body element
            const gridBody = document.querySelector('.grid-body');
            if (!gridBody) {
                setTimeout(collectPlannerCardData, 10);
                return;
            }

            // Get the aria-rowindex element of whatever index we are on
            const ariaRowIndex = gridBody.querySelector(`[aria-rowindex="${collectIndex}"]`);
            if (!ariaRowIndex) {
                setTimeout(collectPlannerCardData, 10);
                return;
            }
            ariaRowIndex.scrollIntoView({ behavior: 'auto', block: 'center' });

            const taskNameElement = ariaRowIndex.querySelector('[aria-colindex="2"]');
            if (!taskNameElement) {
                setTimeout(collectPlannerCardData, 10);
                return;
            }
            taskNameElement.scrollIntoView({ behavior: 'auto', block: 'center' });

            const columnTitleElement = ariaRowIndex.querySelector('[aria-colindex="6"]');
            if (!columnTitleElement) {
                setTimeout(collectPlannerCardData, 10);
                return;
            }
            columnTitleElement.scrollIntoView({ behavior: 'auto', block: 'center' });

            // Get the name of the card
            const taskName = taskNameElement.textContent.trim();
            const columnTitle = columnTitleElement.textContent.replace('', '').trim();

            if (taskName === "" || columnTitle === "") {
                setTimeout(collectPlannerCardData, 10);
                return;
            }

            lastGotTime = Date.now();

            // Highlight the row
            ariaRowIndex.style.backgroundColor = 'grey';

            const serialNumber = taskName.split('_')[0];
            console.log("Miner Serial Number: ", serialNumber);
            console.log("Column Title: [" + columnTitle + "]");
            let cardData = {
                columnTitle: columnTitle,
                url: window.location.href.replace('grid', 'board')
            };
            newPlannerData[serialNumber] = cardData;
            //GM_SuperValue.set("plannerCardsData_" + plannerID, newPlannerData);

            collectIndex++;
            
            setTimeout(collectPlannerCardData, 1); // Retry every 100ms
        }
        collectPlannerCardData();


        
        let minerSNLookup = GM_SuperValue.get("minerSNLookup", {});

        // Logic for adding button on planner card that will open the miner page
        let previousMinerID = "";
        function addOpenMinerButton() {
            // Check if taskEditor-dialog-header exists
            const taskDetailsTitleSection = document.querySelector('#taskDetailsTitleSectionId');
            if (!taskDetailsTitleSection) {
                return;
            }

            // Logic to get the serial number of the miner and check if it exists in the lookup
            let taskNameTextField = document.querySelector('input[placeholder="Task name"]');
            let taskName = taskNameTextField.value;
            let serialNumber = taskName.split('_')[0];
            const minerData = minerSNLookup[serialNumber] || {};
            let minerID = minerData.minerID;
            

            // Check if the button already exists
            const openMinerButton = document.querySelector('#openMinerButton');
            if (openMinerButton && previousMinerID === minerID) {
                return;
            } else if (openMinerButton) {
                openMinerButton.remove();
            }

            // Store the minerID for future reference
            previousMinerID = minerID;

            // Don't try to add the button if the minerID is not found
            if (!minerID) {
                
                // If the name does seem to be formatted with the serial number, then let the user know it is not found
                // Check if there are _ in the taskName, and no spaces in the serial number
                if (taskName.includes('_') && !serialNumber.includes(' ') && serialNumber.length > 5) {
                    // Create the button and add it to into the taskEditor-dialog-header on the left side
                    const button = document.createElement('button');
                    button.id = 'openMinerButton';
                    button.textContent = 'Miner Not Found';
                    button.style.backgroundColor = 'red';
                    button.style.color = 'white';
                    button.style.border = '5px';
                    button.style.padding = '8px';
                    button.style.borderRadius = '3px';
                    button.style.cursor = 'pointer';
                    button.style.paddingTop = '4px';
                    button.style.paddingBottom = '4px';
                    button.style.display = 'flex';
                    button.style.alignItems = 'center';
                    button.style.justifyContent = 'center';
                    taskDetailsTitleSection.appendChild(button);
                }

                return;
            }

            // Create the miner link
            let minerLink = `https://foundryoptifleet.com/Content/Miners/IndividualMiner?id=${minerID}`;
            
            // Create the button and add it to into the taskEditor-dialog-header on the left side
            const button = document.createElement('button');
            button.id = 'openMinerButton';
            button.textContent = 'Open Miner Page';
            button.style.backgroundColor = 'green';
            button.style.color = 'white';
            button.style.border = '5px';
            button.style.padding = '8px';
            button.style.borderRadius = '3px';
            button.style.cursor = 'pointer';
            button.style.paddingTop = '4px';
            button.style.paddingBottom = '4px';
            button.style.display = 'flex';
            button.style.alignItems = 'center';
            button.style.justifyContent = 'center';
            taskDetailsTitleSection.appendChild(button);

            // Add an event listener to the button
            button.addEventListener('click', () => {
                window.open(minerLink, '_blank');
            });
        }

        // Add observe
        const dialogObserver = new MutationObserver((mutationsList, observer) => {
            addOpenMinerButton();
        });

        const dialogContainer = document.querySelector('#teamsApp');
        if (dialogContainer) {
            dialogObserver.observe(dialogContainer, { childList: true, subtree: true });
        }

        function addSlotIDToCard(card) {
            const taskName = card.getAttribute('aria-label');
            const serialNumber = taskName.split('_')[0];
            const minerData = minerSNLookup[serialNumber] || {
                slotID : "Unknown"
            };
            const slotID = minerData.slotID;

            // Check if it already exists, if it does, check if the slotID is different, if so delete the old one
            let leaveAlone = false;
            const slotIDElement = card.querySelector('.slotID');
            if (slotIDElement) {
                if(slotIDElement.textContent !== `Slot ID: ${slotID}`) {
                    slotIDElement.remove();
                } else {
                    leaveAlone = true;
                }
            }
            
            // If the name does seem to be formatted with the serial number, then add the slot ID to the card
            // Check if there are multiple _ in the taskName, and no spaces in the serial number
            if (taskName.includes('_') && !serialNumber.includes(' ') && serialNumber.length > 5 && !leaveAlone) {
                // Add it above textContent 
                const taskCardContent = card.querySelector('.textContent');
                const slotIDElement = document.createElement('div');
                slotIDElement.classList.add('slotID');
                slotIDElement.style.fontSize = '0.8em';
                slotIDElement.style.color = 'lightgrey';
                if(slotID === "Unknown") {
                    slotIDElement.style.color = 'grey';
                }
                slotIDElement.style.marginTop = '5px';
                slotIDElement.style.marginBottom = '0px';
                slotIDElement.style.marginLeft = '15px';
                slotIDElement.textContent = `Slot ID: ${slotID}`;
                taskCardContent.prepend(slotIDElement);
            }
        }

        // Logic for displaying the Container/Location ID on the planner cards
        function addSlotIDsToPlannerCards() {
            // Loops through all taskCard elements and adds the slot ID to the card
            const taskCards = document.querySelectorAll('.taskCard');
            taskCards.forEach(card => {
                addSlotIDToCard(card);
            });
        }

        // Keep trying to add the slot ID to the cards until there are taskCards
        function wonkyEdgeCaseFixForSlotIDs() {
            const taskCards = document.querySelectorAll('.taskCard');
            if (taskCards.length === 0) {
                setTimeout(() => {
                    wonkyEdgeCaseFixForSlotIDs();
                }, 500);
                return;
            }

            addSlotIDsToPlannerCards();
        }
        wonkyEdgeCaseFixForSlotIDs();
        
        // Set up only run addSlotIDToCard when either a card is changed/added
        const cardObserver = new MutationObserver((mutationsList, observer) => {
            if (window !== window.top) {
                return;
            }
            mutationsList.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    //console.log("Node Added: ", node);
                    if (node.classList && node.classList.contains('taskBoardCard')) {
                        let card = node.querySelector('.taskCard');
                        addSlotIDToCard(card);
                    } else if(node.classList && (node.classList.contains('listboxGroup') || (node.classList.contains('scrollable') && node.getAttribute('data-can-drag-to-scroll') === 'true'))) {
                        //console.log("ListboxGroup or Scrollable with data-can-drag-to-scroll=true added, adding Slot IDs to Planner Cards");
                        //console.log(node);
                        addSlotIDsToPlannerCards();
                    }
                });
            });
        });
        
        // Observe the any changes in the planner
        cardObserver.observe(document.body, { childList: true, subtree: true });

        //--------------------------------------------------

        // Logic for automatically adding a task to the planner

        function setUpAutoCardLogic() {

            // find the aria-label="Filter text box" and input the serial number
            const filterTextBox = document.querySelector('input[aria-label="Filter text box"]');
            if (filterTextBox) {
                filterTextBox.value = "";
                filterTextBox.dispatchEvent(new Event('input', { bubbles: true }));
            } else {
                console.log("Filter text box not found.");
                timeout = setTimeout(setUpAutoCardLogic, 500);
                return;
            }

            console.log("Setting up Auto Card Logic");
            let taskName = GM_SuperValue.get("taskName", "");
            if (taskName === "") {
                console.log("No taskName found.");
                return;
            }

            let taskNotes = GM_SuperValue.get("taskNotes", false);
            if (!taskNotes) {
                console.log("No taskNotes found.");
                return;
            }

            let detailsData = JSON.parse(GM_SuperValue.get("detailsData", "{}"));
            if (Object.keys(detailsData).length === 0) {
                console.log("No detailsData found.");
                return;
            }
            let serialNumber = detailsData['serialNumber'];

            filterTextBox.value = serialNumber;
            filterTextBox.dispatchEvent(new Event('input', { bubbles: true }));
            console.log("Inputting serial number into filter text box:", serialNumber);

            // Set background color to the filter text box
            filterTextBox.style.transition = 'background-color 0.8s';
            filterTextBox.style.backgroundColor = '#c3b900';

            /*
            // find taskFiltersButton and click it
            const taskFilters = document.querySelector('#taskFiltersButton');
            if (taskFilters) {
                const taskFiltersButton = taskFilters.querySelector('button');
                if(taskFiltersButton) {
                    taskFiltersButton.focus();
                    taskFiltersButton.click();
                    console.log("Clicked taskFiltersButton");
                } else {
                    console.log("taskFiltersButton not found.");
                    timeout = setTimeout(setUpAutoCardLogic, 500);
                    return;
                }
            } else {
                console.log("taskFilters not found.");
                timeout = setTimeout(setUpAutoCardLogic, 500);
                return;
            }
            */

            // Add the shake animation effect
            const shakeKeyframes = `
                @keyframes shake {
                    0% { transform: translate(1px, 1px) rotate(0deg); }
                    10% { transform: translate(-1px, -2px) rotate(-1deg); }
                    20% { transform: translate(-3px, 0px) rotate(1deg); }
                    30% { transform: translate(3px, 2px) rotate(0deg); }
                    40% { transform: translate(1px, -1px) rotate(1deg); }
                    50% { transform: translate(-1px, 2px) rotate(-1deg); }
                    60% { transform: translate(-3px, 1px) rotate(0deg); }
                    70% { transform: translate(3px, 1px) rotate(-1deg); }
                    80% { transform: translate(-1px, -1px) rotate(1deg); }
                    90% { transform: translate(1px, 2px) rotate(0deg); }
                    100% { transform: translate(1px, -2px) rotate(-1deg); }
                }
            `;
            const style = document.createElement('style');
            style.innerHTML = shakeKeyframes;
            document.head.appendChild(style);

            // Add pulse animation effect
            const pulseKeyframes = `
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.01); }
                    100% { transform: scale(1); }
                }
            `;
            const style2 = document.createElement('style');
            style2.innerHTML = pulseKeyframes;
            document.head.appendChild(style2);

            let stopChecking = false;
            let existingCard = false;
            let maxTries = 30;
            let curTry = 0;
            function FindIfCardExists() {
                if (stopChecking) { return; }
                
                // Get all sectionToggleButton and expand them
                const sectionToggleButtons = document.querySelectorAll('.sectionToggleButton');
                console.log("sectionToggleButtons: ", sectionToggleButtons);
                sectionToggleButtons.forEach(button => {
                    if (button.getAttribute('aria-expanded') === 'false') {
                        button.click();
                    }
                });

                // Get all the cards and scroll to it if the same serial number is found
                const cards = document.querySelectorAll('.taskCard');
                curTry++;
                console.log("Checking for card with serial number:", serialNumber);
                if (cards.length === 0) {
                    setTimeout(() => {
                        FindIfCardExists();
                    }, 100);
                    return;
                }
                
                if (curTry >= maxTries) {
                    // Reset the search bar
                    filterTextBox.value = '';
                    filterTextBox.dispatchEvent(new Event('input', { bubbles: true }));
                    console.log("Max tries reached, card not found.");

                    // Set search bar color
                    filterTextBox.style.backgroundColor = 'orange';
                    timeout = setTimeout(() => {
                        filterTextBox.style.backgroundColor = '';
                    }, 1000);
                    return;
                }
                cards.forEach(card => {
                    const taskName = card.getAttribute('aria-label');
                    const container = card.querySelector('.container');
                    if (taskName.includes(serialNumber)) {
                        existingCard = container;
                        let columnTitle = container.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('.columnTitle h3').textContent;
                        
                        // Set search bar color
                        filterTextBox.style.backgroundColor = '#1797ff';
                        timeout = setTimeout(() => {
                            filterTextBox.style.backgroundColor = '';
                        }, 1000);

                        // Scroll to the card
                        container.scrollIntoView({ behavior: 'smooth', block: 'center' });

                        // heightlight the card red and shake it
                        container.style.transition = 'background-color 0.8s';
                        container.style.backgroundColor = 'red';
                        container.style.animation = 'shake 1s';
                        setTimeout(() => {
                            container.style.transition = 'background-color 1s';
                            container.style.animation = '';
                            container.style.backgroundColor = '';
                            // set to 'pulse' animation
                            container.style.animation = 'pulse 1s infinite';

                            // red outline
                            container.style.outline = '2px solid red';
                        }, 1000);

                        // Create a notification that the card already exists
                        const notification = document.createElement('div');
                        notification.style.position = 'fixed';
                        notification.style.top = '20px';
                        notification.style.left = '20px';
                        notification.style.backgroundColor = '#ff4d4d'; // Red background
                        notification.style.padding = '10px 20px';
                        notification.style.borderRadius = '5px';
                        notification.style.color = '#fff'; // White text for readability
                        notification.style.fontSize = '14px';
                        notification.style.fontWeight = 'bold';
                        notification.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)'; // Add shadow for sleek look
                        notification.style.transition = 'opacity 0.5s ease'; // Fade effect
                        notification.style.opacity = '0'; // Start hidden
                        notification.innerHTML = `
                            <p>Card already exists.</p>
                            <p>Serial Number: ${serialNumber}</p>
                        `;
                        // Make sure it is always layered on top
                        notification.style.zIndex = '9999';
                        document.body.appendChild(notification);

                        // Fade in the notification
                        setTimeout(() => {
                            notification.style.opacity = '1';
                        }, 10);

                        // Fade out and remove the notification after 5 seconds
                        setTimeout(() => {
                            notification.style.opacity = '0';
                            setTimeout(() => {
                                document.body.removeChild(notification);
                            }, 500); // Wait for fade out transition
                        }, 5000);

                        foundCard = true;
                        console.log("Found the card:", card);
                    } else {
                        console.log("Card not found.");
                    }
                });
            }
            FindIfCardExists();
            function ResetTaskData() {
                GM_SuperValue.set('taskName', '');
                GM_SuperValue.set('taskNotes', '');
                GM_SuperValue.set('taskComment', '');
                GM_SuperValue.set('detailsData', '{}');
            }

            // Function to simulate real typing using execCommand
            function setupTask(inputElement) {
                inputElement.focus();

                let i = 0;
                function typeCharacter() {
                    if (i < taskName.length) {
                        const char = taskName.charAt(i);

                        // Create and dispatch the keydown event
                        const keydownEvent = new KeyboardEvent('keydown', { key: char });
                        inputElement.dispatchEvent(keydownEvent);

                        // Insert the character
                        document.execCommand('insertText', false, char);

                        // Create and dispatch the keyup event
                        const keyupEvent = new KeyboardEvent('keyup', { key: char });
                        inputElement.dispatchEvent(keyupEvent);

                        i++;
                        setTimeout(typeCharacter, 10);
                    } else {

                        // Locate the add task button and click it
                        const addTaskButton = document.querySelector('.addTaskButton');
                        if (addTaskButton) {
                            addTaskButton.click();

                            // Locate the new element with the inputted text
                            const findNewCard_INTERVAL = setInterval(() => {
                                const newElement = document.querySelector(`[aria-label="${taskName}"]`);
                                if (newElement) {
                                    clearInterval(findNewCard_INTERVAL);
                                    // Click the element
                                    newElement.click();

                                    // Now add the text to the notes
                                    const findNotesEditor_INTERVAL = setInterval(() => {
                                        const notesEditor = document.querySelector('.notes-editor');
                                        if (notesEditor) {
                                            clearInterval(findNotesEditor_INTERVAL);

                                            // Click the notes editor to focus it and enter editing mode
                                            notesEditor.click();
                                            notesEditor.focus();

                                            // Change the notes editor's background color to red for testing
                                            //notesEditor.style.backgroundColor = 'red';

                                            // Insert the text into the notes editor
                                            document.execCommand('insertText', false, taskNotes);

                                            const findAddCommentButton_INTERVAL = setInterval(() => {
                                                // Now lets add the comment to the task for the log
                                                const commentField = document.querySelector('textarea[aria-label="New comment"]');
                                                if (commentField) {
                                                    clearInterval(findAddCommentButton_INTERVAL);

                                                    commentField.scrollIntoView({ behavior: 'auto', block: 'center' });
                                                    commentField.click();
                                                    commentField.focus();
                                                    commentField.click();
                                                    setTimeout(() => {
                                                        commentField.click();
                                                        console.log("Inputting:", GM_SuperValue.get("taskComment", ""));
                                                        document.execCommand('insertText', false, GM_SuperValue.get("taskComment", ""));

                                                        // Now find the send button and click it
                                                        const sendButton = document.querySelector('.sendCommentButton');
                                                        if (sendButton) {
                                                            sendButton.click();

                                                            // We'll now reset the taskName and taskNotes values
                                                            GM_SuperValue.set("taskName", "");
                                                            GM_SuperValue.set("taskNotes", "");
                                                            GM_SuperValue.set("taskComment", "");
                                                            GM_SuperValue.set("detailsData", {});

                                                        } else {
                                                            console.error('Notes editor not found.');
                                                        }
                                                    }, 400);
                                                }

                                                
                                            }, 400);

                                        } else {
                                            console.error('Notes editor not found.');
                                        }
                                    }, 600);
                                } else {
                                    console.error('New element not found.');
                                }
                            }, 600); // Add a 500ms delay before locating the new element
                        } else {
                            console.error('Add task button not found.');
                        }
                    }
                }
                typeCharacter();
            }

            let createCardButtons = [];
            function addAutoCardButtons() {

                let taskName = GM_SuperValue.get("taskName", "");
                if (taskName === "") {
                    console.log("No taskName found.");
                    return;
                }

                // See if we're on a repair page
                const tooltipHosts = document.querySelectorAll('.ms-TooltipHost');
                let foundRepair = false;
                for (const tooltipHost of tooltipHosts) {
                    if (tooltipHost.textContent.includes('Repair')) {
                        foundRepair = true;
                        //console.log('Found tooltipHost with "Repair":', tooltipHost);
                        break;
                    }
                }
                if (!foundRepair) {
                    setTimeout(addAutoCardButtons, 1000);
                    return;
                }

                const columnsList = document.querySelector('ul.columnsList');
                if (columnsList) {
                    const columnItems = columnsList.querySelectorAll('li');
                    columnItems.forEach(columnItem => {
                        const columnTitle = columnItem.querySelector('.columnTitle');
                        if (!columnTitle) { return; }

                        const newBucketColumn = columnTitle.getAttribute('title') === 'Add a new bucket';

                        // Column title exists and there is no button already
                        if (!newBucketColumn && columnTitle && !createCardButtons.some(button => button.previousElementSibling === columnTitle)) {
                            const newButton = document.createElement('button');
                            createCardButtons.push(newButton);
                            newButton.textContent = 'Auto-Create Card';
                            newButton.style.marginTop = '6px';
                            newButton.style.marginBottom = '6px';
                            newButton.style.backgroundColor = 'green';
                            newButton.style.color = 'white';
                            newButton.style.border = 'none';
                            newButton.style.padding = '5px 10px';
                            newButton.style.borderRadius = '3px';
                            newButton.style.cursor = 'pointer';
                            newButton.style.textAlign = 'center';
                            newButton.style.display = 'flex';
                            newButton.style.alignItems = 'center';
                            newButton.style.justifyContent = 'center';
                            columnTitle.after(newButton);
                            console.log('Added auto-create card button.');

                            newButton.addEventListener('click', () => {
                                clickAddTaskButton(columnTitle);
                            });
                        }

                    });
                }
                setTimeout(addAutoCardButtons, 500);
            }

            var hasClicked = false;
            function clickAddTaskButton(header) {
                if(hasClicked) { return; }

                stopChecking = true;

                // Remove all the buttons
                createCardButtons.forEach(button => {
                    button.remove();
                });

                // Remove the popup
                const popup = document.getElementById('autoCreateCardPopup');
                if (popup) {
                    document.body.removeChild(popup);
                }
                
                //const headers = document.querySelectorAll('.columnTitle');
                //const header = Array.from(headers).find(el => el.textContent.trim() === 'Diagnosed');
                
                if (header) {
                    hasClicked = true;
                    const container = header.closest('.columnContent');

                    if (container) {
                        const addButton = container.querySelector('.addButton');
                        var textField = container.querySelector('input[placeholder="Enter a task name * (required)"]');

                        if (addButton) {
                            //addButton.style.backgroundColor = 'red';
                            //addButton.style.color = 'white';

                            // Click to start making new task if the menu isn't already there.
                            if(!textField) {
                                addButton.click();
                            }

                            // Set the value of the text field to the task name
                            textField = container.querySelector('input[placeholder="Enter a task name * (required)"]');
                            if (textField) {
                                GM_SuperValue.set("taskName", "");
                                setupTask(textField);
                            } else {
                                console.error('Text field not found.');
                            }

                            return true; // Stop further mutation observations
                        } else {
                            console.error('Add task button not found.');
                        }
                    } else {
                        console.error('Container not found.');
                    }
                }

                return false; // Keep observing for further mutations
            }

            function createAutoCreateCardButton() {
                const popup = document.createElement('div');
                popup.id = 'autoCreateCardPopup';
                popup.style.position = 'fixed';
                popup.style.top = '20px';
                popup.style.right = '20px';
                popup.style.backgroundColor = '#f2f2f2';
                popup.style.padding = '10px';
                popup.style.borderRadius = '5px';
                popup.style.color = '#333';
                popup.style.fontSize = '14px';
                popup.style.fontWeight = 'bold';
                popup.style.outline = '2px solid #333'; // Add outline
                popup.innerHTML = `
                    <p>Model: ${detailsData['model']}</p>
                    <p>Serial Number: ${detailsData['serialNumber']}</p>
                    <p>Slot ID: ${detailsData['locationID']}</p>
                    <button id="cancelButton" style="background-color: red; color: #fff; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-top: 10px;">
                        Cancel
                    </button>
                `;

                // Make sure it is always layered on top
                popup.style.zIndex = '9999';
                document.body.appendChild(popup);

                const cancelButton = document.getElementById('cancelButton');
                cancelButton.addEventListener('click', () => {
                    // Reset the existingCard
                    if (existingCard) {
                        existingCard.style.transition = 'background-color 1s';
                        existingCard.style.animation = '';
                        existingCard.style.backgroundColor = '';
                        existingCard.style.outline = 'none';
                    }

                    // Remove all the buttons
                    createCardButtons.forEach(button => {
                        button.remove();
                    });

                    ResetTaskData();
                    document.body.removeChild(popup);
                    window.close();
                });
            }

            setTimeout(createAutoCreateCardButton, 1000);
            setTimeout(addAutoCardButtons, 500);
        }
        setUpAutoCardLogic();

        // Find the toast container and remove it
        function removeToastContainer() {
            const toastContainer = document.querySelector('.toast-container');
            if (toastContainer) {
                toastContainer.remove();
            } else {
                setTimeout(removeToastContainer, 100); // Check again after 1 second
            }
        }

        removeToastContainer();
    }

    // Return if the URL doesn't match the IP regex
    if (ipURLMatch) {
        const quickGoToLog = GM_SuperValue.get('quickGoToLog', false);
        let findLog = false;
        let selectCategory = "Current Logs";
        if(quickGoToLog && currentUrl.includes(quickGoToLog.ip)) {
            findLog = quickGoToLog.errorText;
            selectCategory = quickGoToLog.category;
            GM_SuperValue.set('quickGoToLog', false);
        }

         // Scan Error Logs Logic
         let isScanning = false;
         let homePage = document.getElementById('homePage');
         let currentlyScanning = GM_SuperValue.get('currentlyScanning', {});
         let foundMiner = null;
         let isFoundry = currentUrl.includes("#/");
         if (currentlyScanning && Object.keys(currentlyScanning).length > 0) {
             // Loop through currentlyScanning via object keys and find if the ipAdress matches any of the miners
             Object.keys(currentlyScanning).forEach(miner => {
                 let currentMiner = currentlyScanning[miner];
                 if(currentUrl.includes(currentMiner.ipAddress)) {
                     foundMiner = currentMiner;
                     return;
                 }
             });
 
             if (foundMiner) {
                isScanning = true;
                
                if(!isFoundry) {
                    // 12 second timeout to refresh the page
                    setTimeout(() => {
                        window.location.reload();
                    }, 7000);
                }
             }
         }
 
        let loadedFoundryGUI = false;
        if (isFoundry) {
            function clickCategory() {
                let tabs = document.querySelectorAll('.react-tabs__tab-list');

                if(!tabs || tabs.length === 0 || !tabs[0].childNodes || tabs[0].childNodes.length === 0) {
                    setTimeout(() => {
                        clickCategory();
                    }, 0);
                    return;
                }

                // loop through all the tabs
                tabs.forEach(tab => {
                    // loop through all the tab elements
                    tab.childNodes.forEach(tabElement => {
                        // If the tab element contains the category text, then click it
                        if(tabElement.textContent.includes(selectCategory)) {
                            tabElement.click();
                            // then click document body to fix the weird selection visual
                            setTimeout(() => {
                                if(!isScanning) {
                                    let refreshButton = document.querySelector('.m-button.is-ghost');
                                    refreshButton.click();
                                }
                            }, 1);
                        }

                        if(isScanning && tabElement.textContent.includes('Reboot Logs')) {
                            setTimeout(() => {
                                tabElement.click();
                            }, 1000);

                            // repeativly check if loadedFoundryGUI is the true then click and end the loop
                            let interval = setInterval(() => {
                                if(loadedFoundryGUI) {
                                    tabElement.click();
                                    clearInterval(interval);
                                }
                            }, 500);
                        }
                    });
                });
            }
            clickCategory();
         }

        let clickedAutoRefresh = false;
        let changingLog = false;
        let lastTextLog = "";
        function setUpErrorLog() { //(logContent, ) {
            // Locate the log content element
            const logContent = document.querySelector('.log-content') || document.querySelector('.logBox-pre');

            function removeOldErrorTab() {
                // If it found the error tab, remove it
                const oldErrorTab = document.querySelector('[data-id="errors"]');
                if (oldErrorTab) {
                    // Remove any inner elements
                    const errorSubMenu = document.querySelector('#errorSubMenu');
                    if (errorSubMenu) {
                        errorSubMenu.remove();
                    }

                    oldErrorTab.remove();
                }

                // If found old error tab separator, remove it
                const oldSeparator = document.querySelector('.separator');
                if (oldSeparator) {
                    oldSeparator.remove();
                }
            }

            if(!logContent) {
                removeOldErrorTab();
                if(!window.location.href.includes('log')) {
                    clickedAutoRefresh = false;
                }
                return;
            }

            const existingErrorElement = document.getElementById(`errorLogElement`);
            if (existingErrorElement) {
                return;
            } else {
                if(lastTextLog !== logContent.textContent) {
                    lastTextLog = logContent.textContent;
                } else {
                    return;
                }
            }

            // Return if the log content is empty
            if (!logContent.textContent || logContent.textContent.length === 0) {
                return;
            }

            removeOldErrorTab();

            // If the log content exists, run the error tab setup
            if(logContent && logContent.textContent.includes("\n")) {
                // Scroll to bottom of the log content
                logContent.scrollTop = logContent.scrollHeight;

                // On tab change
                const tabs = document.querySelectorAll('.tab span');
                tabs.forEach(tab => {
                    tab.addEventListener('click', () => {
                        removeOldErrorTab();
                        setTimeout(runAntMinerGUIAdjustments, 500);
                    });
                });

                // Make sure the log content is not overlayed over anything
                logContent.style.position = 'relative';

                // If we didn't already add the error tab, add it
                const oldErrorTab = document.querySelector('[data-id="errors"]');
                if (!oldErrorTab) {
                    // Search through the log and locate errors
                    const logText = logContent.innerText;
                    var errorsFound = runErrorScanLogic(logText);

                    function createErrorTab(title, errors) {
                        // Create a new element to display the errors
                        if (errors.length > 0) {
                            // Locate the menu element
                            let menu = document.querySelector('.menu-t.menu');
                            if(!menu) {
                                menu = document.querySelector('.m-uishell-left-panel');

                                // Find and toggle off auto refresh if it is on (<label for="toggle" class="switch"></label>)
                                const autoRefresh = document.querySelector('.switch[for="toggle"]');
                                if(autoRefresh && !clickedAutoRefresh) {
                                    autoRefresh.click();
                                    clickedAutoRefresh = true;
                                }
                            }

                            if (menu) {
                                // Set the menu's scroll bar to be a nice skinny dark one
                                menu.style.overflowY = 'auto';
                                menu.style.scrollbarWidth = 'thin';
                                menu.style.scrollbarColor = '#444 #222';

                                const style = document.createElement('style');
                                style.textContent = `
                                    .menu-t.menu::-webkit-scrollbar {
                                        width: 8px;
                                    }
                                    .menu-t.menu::-webkit-scrollbar-track {
                                        background: #222;
                                    }
                                    .menu-t.menu::-webkit-scrollbar-thumb {
                                        background-color: #444;
                                        border-radius: 10px;
                                        border: 2px solid #222;
                                    }
                                    li .item {
                                        display: flex;
                                        align-items: center;
                                    }

                                    .item .icon,
                                    .item .itm-name,
                                    .item div {
                                        display: inline-block;
                                        vertical-align: middle;
                                        margin: 0;
                                    }
                                    .item div {
                                        margin-left: auto; /* Pushes the "i" icon to the right */
                                        line-height: normal; /* Adjust to align the circle vertically */
                                    }
                                `;
                                document.head.appendChild(style);
                                

                                // Add line separator, if it doesn't already exist
                                if (!document.querySelector('.separator')) {
                                    const separator = document.createElement('li');
                                    separator.style.borderBottom = '1px solid #ccc';
                                    separator.style.margin = '10px 0';
                                    separator.classList.add('separator');
                                    menu.appendChild(separator);
                                }

                                // Create a new list item for errors
                                const errorTab = document.createElement('li');
                                errorTab.classList.add('item');
                                errorTab.setAttribute('data-id', 'errors');
                                errorTab.innerHTML = `<i class="error-ico icon"></i> <span class="itm-name" data-locale="errors">${title}</span> <i class="drop-icon"></i>`;

                                // Check if errorTab is pressed
                                errorTab.addEventListener('click', () => {
                                    setTimeout(adjustLayout, 0);
                                });

                                if(isFoundry) {
                                    // Add a nice font to the error tab and sub-menu
                                    const fontStyle = document.createElement('style');
                                    fontStyle.textContent = `
                                        .menu-t.menu, .sub-menu.menu, .itm-name  {
                                            font-family: 'Arial', sans-serif;
                                            font-size: 14px;
                                        }
                                    `;
                                    document.head.appendChild(fontStyle);

                                    
                                    errorTab.style.marginBottom = '10px';

                                    // click error tab twice to fix it appearing opened
                                    setTimeout(() => {
                                        errorTab.click();
                                        errorTab.click();
                                    }, 0);
                                }

                                // Light blue text when hovering over the error tab
                                errorTab.addEventListener('mouseover', () => {
                                    errorTab.style.color = '#5FB2FF';

                                    // change mouse cursor to pointer
                                    errorTab.style.cursor = 'pointer';
                                });

                                errorTab.addEventListener('mouseout', () => {
                                    errorTab.style.color = '#E2E2E2';

                                    // change mouse cursor to default
                                    errorTab.style.cursor = 'default';
                                });

                                // Create a sub-menu for the errors
                                const errorSubMenu = document.createElement('ul');
                                errorSubMenu.classList.add('sub-menu', 'menu');
                                errorSubMenu.id = 'errorSubMenu';

                                // set a slight padding to the sub-menu
                                errorSubMenu.style.paddingLeft = '10px';
                                
                                // Find and replace the drop icon so it doesn't flip when the other sub-menu is opened
                                const dropIcon = errorTab.querySelector('.drop-icon');
                                if (dropIcon) {
                                    dropIcon.remove();
                                }

                                const dropIcon2 = document.createElement('i');
                                dropIcon2.classList.add('icon2');
                                dropIcon2.style.backgroundImage = 'url(https://img.icons8.com/?size=100&id=2760&format=png&color=FFFFFF)';
                                dropIcon2.style.width = '16px';
                                dropIcon2.style.height = '16px';
                                dropIcon2.style.display = 'inline-block';
                                dropIcon2.style.backgroundSize = 'contain';
                                if(isFoundry) {
                                    dropIcon2.style.position = 'relative';
                                    dropIcon2.style.float = 'right';
                                    dropIcon2.style.marginRight = '10px';
                                }
                                errorTab.appendChild(dropIcon2);

                                // Swap the left empty icon source with the error icon
                                const errorIcon = errorTab.querySelector('.error-ico');
                                if (errorIcon) {
                                    errorIcon.style.backgroundImage = 'url(https://img.icons8.com/?size=100&id=24552&format=png&color=FFFFFF)';
                                    
                                    errorIcon.style.display = 'inline-block';
                                    errorIcon.style.backgroundSize = 'contain';
                                    errorIcon.style.marginRight = '5px';
                                }

                                // Populate the sub-menu with error details
                                errors.forEach((error, index) => {
                                    const errorItem = document.createElement('li');
                                    errorItem.classList.add('item');
                                    errorItem.setAttribute('data-id', `error-${index}`);
                                    errorItem.innerHTML = `<i class="error-detail-ico icon"></i> <span class="itm-name">${error.name}</span>`;
                                    if(isFoundry) {
                                        errorItem.style.cursor = 'pointer';
                                        // add padding to the error item
                                        errorItem.style.padding = '5px 8px 5px 0px';
                                        errorItem.style.verticalAlign = 'middle';
                                    }

                                    function resetLogText() {
                                        // Remove any children of the log content
                                        while (logContent.firstChild) {
                                            logContent.removeChild(logContent.firstChild);
                                        }

                                        // Re-add the original log content
                                        logContent.textContent = logText;
                                    }
                                    errorItem.addEventListener('click', () => {
                                        changingLog = true;

                                        resetLogText();

                                        // Create a new element to highlight the error
                                        const errorElement = document.createElement('span');
                                        errorElement.style.backgroundColor = '#ffcccc';
                                        errorElement.style.color = 'black';
                                        errorElement.style.width = '100%';
                                        errorElement.style.display = 'block';

                                        errorElement.setAttribute('data-original-text', error.text);
                                        errorElement.textContent = error.text;
                                        errorElement.setAttribute('data-original-text', error.text);

                                        errorElement.id = `errorLogElement`;

                                        // In bottom right corner add a copy button
                                        const copyButton = document.createElement('button');
                                        copyButton.textContent = 'Copy';
                                        copyButton.style.position = 'absolute';
                                        copyButton.style.bottom = '0';
                                        copyButton.style.right = '0';
                                        copyButton.style.backgroundColor = 'transparent';
                                        copyButton.style.border = 'none';
                                        copyButton.style.color = 'black';
                                        copyButton.style.cursor = 'pointer';
                                        copyButton.style.padding = '5px';
                                        copyButton.style.fontSize = '12px';
                                        copyButton.style.fontWeight = 'bold';
                                        copyButton.style.zIndex = '1';
                                        copyButton.addEventListener('click', () => {
                                            // Copy the error text to the clipboard
                                            if (navigator.clipboard) {
                                                navigator.clipboard.writeText(error.text).then(() => {
                                                    console.log('Text copied to clipboard');
                                                }).catch(err => {
                                                    console.error('Failed to copy text: ', err);
                                                });
                                            } else {
                                                // Fallback method for older browsers
                                                const textArea = document.createElement('textarea');
                                                textArea.value = error.text;
                                                document.body.appendChild(textArea);
                                                textArea.select();
                                                try {
                                                    document.execCommand('copy');
                                                    console.log('Text copied to clipboard');
                                                } catch (err) {
                                                    console.error('Failed to copy text: ', err);
                                                }
                                                document.body.removeChild(textArea);
                                            }

                                            // Change the button text to copied
                                            copyButton.textContent = 'Copied!';
                                            setTimeout(() => {
                                                copyButton.textContent = 'Copy';
                                            }, 1000);
                                        });
                                        
                                        // Add as child of error element
                                        errorElement.style.position = 'relative'; // Ensure the errorElement is positioned relative
                                        errorElement.appendChild(copyButton);

                                        // While hovering over the error element, show the copy button
                                        errorElement.addEventListener('mouseover', () => {
                                            copyButton.style.display = 'block';
                                        });

                                        errorElement.addEventListener('mouseout', () => {
                                            copyButton.style.display = 'none';
                                        });

                                        // When hover, change the copy button color
                                        copyButton.addEventListener('mouseover', () => {
                                            copyButton.style.color = 'green';
                                        });

                                        copyButton.addEventListener('mouseout', () => {
                                            copyButton.style.color = 'black';
                                        });

                                        // Replace the error text in the log with the highlighted version
                                        const logTextNode = logContent.childNodes[0];
                                        const beforeErrorText = logTextNode.textContent.substring(0, error.start);
                                        const afterErrorText = logTextNode.textContent.substring(error.end);

                                        logTextNode.textContent = beforeErrorText;
                                        logContent.insertBefore(errorElement, logTextNode.nextSibling);
                                        logContent.insertBefore(document.createTextNode(afterErrorText), errorElement.nextSibling);

                                        // Scroll to the highlighted error
                                        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

                                        setTimeout(() => {
                                            changingLog = false;
                                        }, 0);
                                    });
                                    errorSubMenu.appendChild(errorItem);

                                    // highlight text when hovering over the error
                                    errorItem.addEventListener('mouseover', () => {
                                        errorItem.style.backgroundColor = '#444';
                                        errorItem.style.color = '#fff';
                                    });

                                    errorItem.addEventListener('mouseout', () => {
                                        errorItem.style.backgroundColor = 'transparent';
                                        errorItem.style.color = '#E2E2E2';
                                    });

                                    if(findLog && error.text.includes(findLog)) {
                                        // Open the error list
                                        setTimeout(() => {
                                            errorTab.click();

                                            // Scroll to the error item
                                            errorItem.scrollIntoView({ behavior: 'smooth', block: 'center' });

                                            // highlight that fades out
                                            errorItem.style.transition = 'background-color 1s';
                                            errorItem.style.backgroundColor = '#444';
                                            setTimeout(() => {
                                                errorItem.style.backgroundColor = 'transparent';
                                            }, 1000);
                                        }, 0);

                                        // Go to the error
                                        errorItem.click();
                                        findLog = false;
                                    }

                                    // Set the icon for the error <i class="error-detail-ico icon"></i>
                                    const errorDetailIcon = errorItem.querySelector('.error-detail-ico');
                                    if (errorDetailIcon) {
                                        errorDetailIcon.style.backgroundImage = error.icon !== undefined ? `url(${error.icon})` : 'url(https://img.icons8.com/?size=100&id=51Tr6obvkPgA&format=png&color=FFFFFF)';
                                        errorDetailIcon.style.display = 'inline-block';
                                        errorDetailIcon.style.backgroundSize = 'contain';
                                        errorDetailIcon.style.marginRight = '5px';
                                        errorDetailIcon.style.width = '22px';
                                        errorDetailIcon.style.height = '22px';
                                    }
                                    
                                    // Create an info icon to the right that will show the error text
                                    const infoIcon = document.createElement('div');
                                    infoIcon.style.width = '14px';
                                    infoIcon.style.height = '14px';
                                    infoIcon.style.borderRadius = '50%';
                                    infoIcon.style.backgroundColor = '#0078d4';
                                    infoIcon.style.color = 'white';
                                    infoIcon.style.textAlign = 'center';
                                    infoIcon.style.verticalAlign = 'middle';
                                    infoIcon.style.lineHeight = '14px';
                                    infoIcon.style.fontSize = '8px';
                                    infoIcon.style.border = '1px solid black';
                                    infoIcon.style.fontWeight = 'bold';
                                    infoIcon.style.textShadow = '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000';
                                    infoIcon.style.cursor = 'pointer';
                                    infoIcon.style.position = 'relative';
                                    infoIcon.style.float = 'right';
                                    infoIcon.style.display = 'inline-block';
                                    infoIcon.textContent = 'i';
                                                                
                                    // Create the tooltip
                                    const tooltip = document.createElement('div');
                                    tooltip.style.display = 'none';
                                    tooltip.style.position = 'absolute';
                                    tooltip.style.backgroundColor = '#444947';
                                    tooltip.style.color = 'white';
                                    tooltip.style.padding = '5px';
                                    tooltip.style.borderRadius = '5px';
                                    tooltip.style.zIndex = '9999';
                                    tooltip.style.whiteSpace = 'pre-wrap'; // Use pre-wrap to preserve newlines
                                    tooltip.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)';
                                    tooltip.textContent = error.text;
                                    document.body.appendChild(tooltip);

                                    // Position the tooltip relative to the infoIcon
                                    infoIcon.addEventListener('mouseenter', () => {
                                        const rect = infoIcon.getBoundingClientRect();
                                        tooltip.style.left = `${rect.left + window.scrollX}px`;
                                        tooltip.style.top = `${rect.top + window.scrollY + 20}px`;
                                        tooltip.style.display = 'block';
                                    });

                                    infoIcon.addEventListener('mouseleave', () => {
                                        tooltip.style.display = 'none';
                                    });

                                    // Position the tooltip relative to the infoIcon
                                    infoIcon.addEventListener('mouseenter', () => {
                                        const rect = infoIcon.getBoundingClientRect();
                                        tooltip.style.left = `${rect.left + window.scrollX}px`;
                                        tooltip.style.top = `${rect.top + window.scrollY + 20}px`;
                                        tooltip.style.display = 'block';
                                    });
                                    
                                    infoIcon.addEventListener('mouseleave', () => {
                                        tooltip.style.display = 'none';
                                    });

                                    // Append the info icon to the error item
                                    errorItem.appendChild(infoIcon);

                                });

                                // Append the error tab and sub-menu to the menu
                                menu.appendChild(errorTab);
                                menu.appendChild(errorSubMenu);

                                // Add event listener to toggle the sub-menu
                                errorTab.addEventListener('click', () => {
                                    const isVisible = errorSubMenu.style.display === 'block';
                                    errorSubMenu.style.display = isVisible ? 'none' : 'block';
                                });

                                console.log('Error tab and sub-menu added successfully');
                            } else {
                                console.error('Menu element not found');
                            }

                            adjustLayout();
                        }
                    }

                    createErrorTab("Main Errors", errorsFound.filter(error => !error.unimportant));
                    createErrorTab("Other Errors", errorsFound.filter(error => error.unimportant));
                    if(isScanning && logContent && logContent.textContent.includes("\n")) {
                        const minerID = foundMiner.id;
                        let errorsFoundSave = GM_SuperValue.get('errorsFound', {});
                        errorsFoundSave[minerID] = errorsFound.filter(error => !error.unimportant) || [];

                        if(isFoundry) {
                            let category = "";
                            let selectedCurrent = document.querySelector('.react-tabs__tab.react-tabs__tab--selected');
                            if(selectedCurrent) {
                                category = selectedCurrent.textContent;
                            }

                            // If we're on the Reboot Logs, get the error with highest start index
                            if(category === "Reboot Logs") {
                                let lastError = errorsFoundSave[minerID].sort((a, b) => b.start - a.start)[0];
                                if(lastError && lastError.text) {

                                    // Remove all errors that are before the last error
                                    errorsFoundSave[minerID] = [lastError];

                                    // split the error text and get the date "11/02/24 00:27:35 Exit due to FANS NOT DETECTED | FAN FAILED"
                                    errorsFoundSave[minerID].forEach(error => {
                                        const errorText = error.text.split(' ');
                                        const date = errorText[0];
                                        const time = errorText[1];

                                        // check if the date is today
                                        const today = new Date();
                                        const todayString = `${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}/${today.getFullYear().toString().slice(-2)}`;
                                        
                                        if(date !== todayString) {
                                            errorsFoundSave[minerID] = [];
                                            //alert('No errors found today\n\n' + error.text + '\n\n Date: ' + date + '\n\n todayString: ' + todayString);
                                        }
                                    });
                                }
                            }

                            // loop through errorsFoundSave[minerID] and add the category to each error
                            errorsFoundSave[minerID].forEach(error => {
                                if(!error) {
                                    return;
                                }
                                error.category = category;
                            });

                            /* goofy
                            if(category === "Reboot Logs") {
                                GM_SuperValue.set('errorsFound', errorsFoundSave);
                                GM_SuperValue.set('minerGUILoaded_' + foundMiner.id, true);
                                return;
                            }
                                */

                            // if the category isn't Reboot Logs, and the errors are empty, return
                            if(category !== "Reboot Logs" && errorsFoundSave[minerID].length === 0) {
                                loadedFoundryGUI = true;
                                return;
                            }
                        }

                        // Save the errors found
                        GM_SuperValue.set('errorsFound', errorsFoundSave);
                        //GM_SuperValue.set('minerGUILoaded_' + foundMiner.id, true);
                        console.log('Errors found and saved');
                    }
                }

                //setTimeout(adjustLayout, 500);
            } else {
                removeOldErrorTab();
            }
        }

        function adjustLayout() {
            homePage = document.getElementById('homePage');
            if (homePage) {
                // At certain zoom levels the homePage seemingly disappears, going down beneath the whole page
                // This is a workaround to fix that
                homePage.style.display = 'block';
                homePage.style.position = 'absolute';
                homePage.style.top = '0';
                homePage.style.right = '0';

                // Get the width left for the homePage based on how much layout-l fl takes up
                const layoutL = document.querySelector('.layout-l');
                if (layoutL) {
                    const logContent = document.querySelector('.log-content');
                    const footer = document.querySelector('.footer.clearfix');
                    const mainContent = document.querySelector('.main-content');
                    if (logContent) {
                        mainContent.style.paddingBottom = '0';
                        footer.style.display = 'none';
                    } else {
                        const footerHeight = footer.offsetHeight;
                        mainContent.style.paddingBottom = `${footerHeight}px`;
                        footer.style.display = 'block';
                    }

                    const layoutLWidth = layoutL.offsetWidth;
                    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
                    homePage.style.width = `calc(100% - ${layoutLWidth+scrollBarWidth}px)`;
                    
                    // find head clearfix and set the width to the same as homePage
                    const headClearfix = document.querySelector('.head.clearfix');
                    if (headClearfix) {
                        headClearfix.style.width = homePage.style.width;
                    } else {
                        console.error('Head clearfix not found');
                    }

                    // Find the footer and set the width to the same as homePage
                    if (footer) {
                        footer.style.width = homePage.style.width;
                    } else {
                        console.error('Footer not found');
                    }
                }
            }
        }  

        // Function to check the current URL
        var lastRunTime = 0; // Note this run time is refering to last time the function was run, not the miner run/uptime time
        var lastRealUpTime = 0;
        var lastUpTimeInterval = null;
        function runAntMinerGUIAdjustments() {
            // Check if the last run was less than 10ms ago, stops it from running too often
            if (Date.now() - lastRunTime < 10) {
                return;
            }
            lastRunTime = Date.now();

            // Add link to firmware downloads if on firmware upgrade page
            const formsContent = document.querySelector('.forms-content');
            const formsTitle = document.querySelector('.forms-title[data-locale="update"]');
            
            if (formsContent && formsTitle) {
                const linkAlreadyExists = formsContent.querySelector('a[href="https://shop.bitmain.com/support/download"]');
                if (linkAlreadyExists) { return; }
                const link = document.createElement('a');
                link.href = 'https://shop.bitmain.com/support/download';
                link.target = '_blank'; // Open in a new tab
                link.textContent = 'Bitmain Firmware Downloads Page';
                link.style.display = 'block';
                link.style.marginBottom = '10px';
                formsContent.insertBefore(link, formsContent.firstChild);

                // on press, save the current miner type and algorithm
                link.addEventListener('click', () => {
                    const minerType = document.querySelector('.miner-type').textContent;
                    const algorithm = document.querySelector('.algorithm').textContent;
                    GM_SuperValue.set('minerType', minerType);
                    GM_SuperValue.set('algorithm', algorithm);
                });

                // Foundry Site Ops Firmware Downloads
                const foundryLink = document.createElement('a');
                foundryLink.href = 'https://foundrydigitalllc.sharepoint.com/:f:/s/SiteOps/Ejr69n4RQN5Nk9JjF4fW00YBnxf38XEYL7Ubf9xIwgh9bA?e=HwAMls';
                foundryLink.target = '_blank'; // Open in a new tab
                foundryLink.textContent = 'Foundry Site Ops Firmware Downloads';
                foundryLink.style.display = 'block';
                foundryLink.style.marginBottom = '10px';
                formsContent.insertBefore(foundryLink, link.nextSibling);
            }
        }

        // Function to update the estimated time
        function updateEstimatedTime() {
            const minerRunningTimeElement = document.querySelector('td span[data-locale="mRunTm"]');
            if (!minerRunningTimeElement || !minerRunningTimeElement.nextElementSibling) {
                setTimeout(updateEstimatedTime, 0);
                return;
            }

            // Function to parse the current running time
            function parseRunningTime(stringReturn = false) {
                const timeElements = minerRunningTimeElement.nextElementSibling.querySelectorAll('.num');
                const days = parseInt(timeElements[0].textContent, 10);
                const hours = parseInt(timeElements[1].textContent, 10);
                const minutes = parseInt(timeElements[2].textContent, 10);
                const seconds = parseInt(timeElements[3].textContent, 10);
                if (stringReturn) {
                    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
                }

                return { days, hours, minutes, seconds };
            }

            // Function to format the time
            function formatTime({ days, hours, minutes, seconds }) {
                return `${days}d ${hours}h ${minutes}m ${seconds}s`;
            }

            // Get the current estimated time element
            let estimatedTimeElement = document.querySelector('.estimated-time');
            if (estimatedTimeElement) {
                if (lastRealUpTime === parseRunningTime(true)) {
                    return;
                } else {
                    clearInterval(lastUpTimeInterval);
                }
            }
            lastRealUpTime = parseRunningTime(true);
            

            // Create a new element for the estimated time if it doesn't already exist
            if(!estimatedTimeElement) {
                estimatedTimeElement = document.createElement('span');
                estimatedTimeElement.className = 'estimated-time';
                estimatedTimeElement.style.display = 'block';
                minerRunningTimeElement.parentNode.appendChild(estimatedTimeElement);
            }

            // Function to increment the time
            function incrementTime(time) {
                time.seconds++;
                if (time.seconds >= 60) {
                    time.seconds = 0;
                    time.minutes++;
                }
                if (time.minutes >= 60) {
                    time.minutes = 0;
                    time.hours++;
                }
                if (time.hours >= 24) {
                    time.hours = 0;
                    time.days++;
                }
                return time;
            }

            // Initial time
            let currentTime = parseRunningTime();
            currentTime = incrementTime(currentTime);
            estimatedTimeElement.textContent = `Estimated Live: ${formatTime(currentTime)}`;

            // Update the estimated time every second
            lastUpTimeInterval = setInterval(() => {
                currentTime = incrementTime(currentTime);
                estimatedTimeElement.textContent = `Estimated Live: ${formatTime(currentTime)}`;
            }, 1000);
        }

        // Call the function to start updating the estimated time
        updateEstimatedTime();

        // Run the check on mutation
        const observer = new MutationObserver((mutations) => {
            const logContent = document.querySelector('.logBox-pre');
            if (!logContent) {
                adjustLayout();
                updateEstimatedTime();
                runAntMinerGUIAdjustments();
            }
            
            setUpErrorLog();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Auto select saved miner type and algorithm
    if (currentUrl.includes("https://shop.bitmain.com/support/download")){
        setTimeout(() => {
            var minerType = GM_SuperValue.get('minerType', '').toLowerCase();
            var algorithm = GM_SuperValue.get('algorithm', '').toLowerCase();

            if(algorithm === "sha256d") {
                algorithm = "sha256";
            }

            // Remove the saved values
            GM_SuperValue.set('minerType', '');
            GM_SuperValue.set('algorithm', '');

            if (minerType !== '' && algorithm !== '') {
                const algorithmDropdown = document.querySelector('.filter-box .filter:nth-child(1) input');
                const modelDropdown = document.querySelector('.filter-box .filter:nth-child(2) input');

                if (algorithmDropdown && modelDropdown) {
                   

                    var algorithmDropdownFound = false;
                    var modelDropdownFound = false;

                    const intervalAlgorithm = setInterval(() => {
                        algorithmDropdown.focus();
                        algorithmDropdown.click();
    
                        algorithmDropdown.style.backgroundColor = '#ffcc99';

                        setTimeout(() => {
                            const algorithmOptions = document.querySelectorAll('.filter-box .filter:nth-child(1) ul li');
                            algorithmOptions.forEach(option => {
                                console.log(option.textContent);
                                if (option.textContent.toLocaleLowerCase().trim().includes(algorithm)) {
                                    option.focus();
                                    option.click();
                                    algorithmDropdown.style.backgroundColor = '#99ff99';
                                    algorithmDropdownFound = true;
                                    clearInterval(intervalAlgorithm);
                                    const intervalModel = setInterval(() => {
                                        modelDropdown.focus();
                                        modelDropdown.click();
                
                                        modelDropdown.style.backgroundColor = '#ffcc99';
                
                                        setTimeout(() => {
                                            const modelOptions = document.querySelectorAll('.filter ul li');
                                            modelOptions.forEach(option => {
                                                if (option.textContent.toLocaleLowerCase().trim() === minerType) {
                                                    option.focus();
                                                    option.click();
                                                    // set it a light green color
                                                    modelDropdown.style.backgroundColor = '#99ff99';
                                                    modelDropdownFound = true;
                                                    clearInterval(intervalModel);
                                                    return;
                                                }
                                            });
                
                                            // If the algorithm wasn't found, set it to red
                                            if(!modelDropdownFound) {
                                                modelDropdown.style.backgroundColor = '#ff6666';
                                            }
                                        }, 100);
                                    }, 200);
                                    return;
                                }
                            });

                            // If the algorithm wasn't found, set it to red
                            if (!algorithmDropdownFound) {
                                algorithmDropdown.style.backgroundColor = '#ff6666';
                            }
                        }, 100);
                    }, 200);
                }
            }
        }, 800);
    }
});
