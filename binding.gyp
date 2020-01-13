{
  "target_defaults": {
    'conditions': [
      ['OS=="win"', {
        'defines': [
          '_WINDOWS',
        ],
      }]
    ],
  },
  "targets": [
    { 
      "variables": {
        "CURRENT_DIR": "<(PRODUCT_DIR)/../..",
      },
      # "cflags": [
      #   "-std=c99",
      #   "-Wall",
      #   "-O2",
      #   "-g",
      # ],
      "cflags!": [
        "-fno-exceptions"
      ],
      "cflags_cc!": [
        "-fno-exceptions"
      ],
      "include_dirs" : [
        "<!@(node -p \"require('node-addon-api').include\")",
        "deps/picotls/lib/cifra",
        "deps/picotls/deps/cifra/src/ext",
        "deps/picotls/deps/cifra/src",
        "deps/picotls/deps/micro-ecc",
        "deps/picotls/deps/picotest",
        "deps/picotls/picotlsvs/picotls",
        "deps/picotls/include",
        "deps/picotls/include/picotls",
      ],
      "target_name": "picotls",
      "conditions": [
        [
          'OS=="win"',
          {
            "libraries": [
              "<(CURRENT_DIR)/deps/picotls/picotlsvs/x64/Release/picotls-minicrypto-deps.lib",
              "<(CURRENT_DIR)/deps/picotls/picotlsvs/x64/Release/picotls-minicrypto.lib",
              "<(CURRENT_DIR)/deps/picotls/picotlsvs/x64/Release/picotls-core.lib",
            ],
          },
          {
            "libraries": [
              "<(CURRENT_DIR)/deps/picotls/libpicotls-core.a",
              "<(CURRENT_DIR)/deps/picotls/libpicotls-minicrypto.a",
            ],
          }
        ]
      ],
      "sources": [ 
        "src/main.cc"
      ],
      "defines": [
        "NAPI_DISABLE_CPP_EXCEPTIONS"
      ],
    }
  ]
}