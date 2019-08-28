// Copyright (c) 2019 WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
//
// WSO2 Inc. licenses this file to you under the Apache License,
// Version 2.0 (the "License"); you may not use this file except
// in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

export let homeStyles: string = `
            <style>
            body{
                font-family: 'Roboto', sans-serif;
                color: #707070;
                font-weight: 300;
            }
            
            .heading-page{
                font-size: 35px;
                text-align: left;
                margin-top: 10%;
                letter-spacing: 0px;
            }
            
            .heading-page-two{
                font-size: 30px;
                margin-top: 10%;
                margin-bottom: 5%;
                letter-spacing: 0px;
            }
            
            a{
                text-decoration: none;
                color: #707070;
            }
            
            a:hover{
                color: #0078CF;
            }
            
            .button-section{
                margin-top: 3%;
            }
            
            .create{
                font-size: 20px;
                text-align: left;
            }
            
            .create > *{
                vertical-align: middle;
            }
            
            .create svg{
                width: 57px;
                margin-right: 15px;
            }
            
            .create svg path{
                fill: #0078CF;
            }
            
            #searchTemplate{
                line-height: 30px;
                padding: 5px 13px;
                font-size: 20px;
                background: #F0F0F0;
                border: 1px solid #BDC3C7;
            
            }
            
            .search{
                position: relative;
            }
            
            .search svg{
                fill: #BDC3C7;
                width: 30px;
                position: absolute;
                right: 7px;
                top: 7px;
            }
            
            .templates{
                margin-top: 3%;
            }
            
            .box{
                width: 302px;
                height: 214px;
                background: #fff;
                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.16);
                float: left;
            }


html {
  font-family: sans-serif; /* 1 */
  -ms-text-size-adjust: 100%; /* 2 */
  -webkit-text-size-adjust: 100%; /* 2 */
}


body {
  margin: 0;
}


article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
main,
menu,
nav,
section,
summary {
  display: block;
}


audio,
canvas,
progress,
video {
  display: inline-block; /* 1 */
  vertical-align: baseline; /* 2 */
}

audio:not([controls]) {
  display: none;
  height: 0;
}

[hidden],
template {
  display: none;
}



a {
  background-color: transparent;
}

a:active,
a:hover {
  outline: 0;
}

abbr[title] {
  border-bottom: 1px dotted;
}

b,
strong {
  font-weight: bold;
}

dfn {
  font-style: italic;
}


h1 {
  font-size: 2em;
  margin: 0.67em 0;
}

mark {
  background: #ff0;
  color: #000;
}

small {
  font-size: 80%;
}


sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sup {
  top: -0.5em;
}

sub {
  bottom: -0.25em;
}

img {
  border: 0;
}

svg:not(:root) {
  overflow: hidden;
}

figure {
  margin: 1em 40px;
}

hr {
  -moz-box-sizing: content-box;
  box-sizing: content-box;
  height: 0;
}


pre {
  overflow: auto;
}

code,
kbd,
pre,
samp {
  font-family: monospace, monospace;
  font-size: 1em;
}


button,
input,
optgroup,
select,
textarea {
  color: inherit; /* 1 */
  font: inherit; /* 2 */
  margin: 0; /* 3 */
}


button {
  overflow: visible;
}


button,
select {
  text-transform: none;
}


button,
html input[type="button"], /* 1 */
input[type="reset"],
input[type="submit"] {
  -webkit-appearance: button; /* 2 */
  cursor: pointer; /* 3 */
}


button[disabled],
html input[disabled] {
  cursor: default;
}

button::-moz-focus-inner,
input::-moz-focus-inner {
  border: 0;
  padding: 0;
}


input {
  line-height: normal;
}

input[type="checkbox"],
input[type="radio"] {
  box-sizing: border-box; /* 1 */
  padding: 0; /* 2 */
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  height: auto;
}

input[type="search"] {
  -webkit-appearance: textfield; /* 1 */
  -moz-box-sizing: content-box;
  -webkit-box-sizing: content-box; /* 2 */
  box-sizing: content-box;
}


input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-decoration {
  -webkit-appearance: none;
}

fieldset {
  border: 1px solid #c0c0c0;
  margin: 0 2px;
  padding: 0.35em 0.625em 0.75em;
}


legend {
  border: 0; /* 1 */
  padding: 0; /* 2 */
}


textarea {
  overflow: auto;
}



optgroup {
  font-weight: bold;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}

td,
th {
  padding: 0;
}
            </style>`;

export let formStyles: string = `
            <style>
                body {
                    font-family: Arial, Helvetica, sans-serif;
                }

                * {
                    box-sizing: border-box;
                }

                body.vscode-light {
                    color: black;
                }
                
                body.vscode-dark {
                    color: white;
                }
                
                body.vscode-high-contrast {
                    color: red;
                }
                
                input[type=text], select, textarea {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    box-sizing: border-box;
                    margin-top: 6px;
                    margin-bottom: 16px;
                    resize: vertical;
                }
                
                input[type=submit], button {
                    background-color: #5F9EA0;
                    color: white;
                    padding: 12px 20px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                
                input[type=submit]:hover, button:hover {
                    background-color: #20B2AA;
                }
                
                .container {
                    border-radius: 5px;
                    padding: 20px;
                    width: 50%
                }
            </style>`;
