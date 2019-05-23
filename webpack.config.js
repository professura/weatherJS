const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require("copy-webpack-plugin");

var JSZip = require('jszip');
const fs = require('fs');
const copydir = require('copy-dir');

function WarArchiverPlugin(options) {
    this.options = options || {};
    this.fileName = options.fileName || 'project.zip';
	this.zip = new JSZip();
}

WarArchiverPlugin.prototype.apply = function(compiler) {
    var self = this;
    self.compiler = compiler.options;

    compiler.plugin('done', function() {

		try {
			fs.accessSync(path.join(self.compiler.output.path, "materials"), fs.F_OK);
		} catch (e) {
			// Dir not exists, create it
			fs.mkdirSync(path.join(self.compiler.output.path, "materials"));
		}

		copydir.sync(path.join(self.compiler.output.path, '..', "materials"), path.join(self.compiler.output.path, "materials"));

		self.zipDir("");

		self.zip.generateNodeStream({type:'nodebuffer',streamFiles:true, platform:'UNIX',})
			   .pipe(fs.createWriteStream(path.join(self.compiler.output.path, '..', self.fileName)));
    });
};

WarArchiverPlugin.prototype.zipDir = function(dpath) {
	let self = this;
	let folder = (dpath.length > 0 ? self.zip.folder(dpath, {createFolders: true}) : self.zip);

	let items = fs.readdirSync(path.join(self.compiler.output.path, dpath));

	for (var i=0, items_length = items.length; i<items_length; i++) {
		let stats = fs.statSync(path.join(self.compiler.output.path, dpath, items[i]));
		if (stats.isDirectory()) {
			self.zipDir(path.join(dpath,items[i]));
		} else {
			if (stats.isFile()) {
				let stream = fs.createReadStream(path.join(self.compiler.output.path, dpath, items[i]));
				folder.file(items[i], stream);
			}
		};
	}

}

var config = {
  entry: "./srcjs/index.js", // string | object | array
  output: {
    // options related to how webpack emits results
    path: path.resolve(__dirname, "./dist"), // string
    // the target directory for all output files
    // must be an absolute path (use the Node.js path module)
    filename: "weatherLocation.js", // string
    // the filename template for entry chunks
    publicPath: "", // string
    // the url to the output directory resolved relative to the HTML page
    library: "weatherLocation", // string,
    // the name of the exported library
    libraryTarget: "umd", // universal module definition
  }, 
  
  module: {
    // configuration regarding modules
    rules: [
      // rules for modules (configure loaders, parser options, etc.)
      {
        test: /.js?$/,
        include: [
          path.resolve(__dirname, "srcjs")
        ],
        exclude: [
        ],
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"]
        },
      },
      {
        test:   /.css?$/,
        loader: "style-loader!css-loader!postcss-loader"          
      }
    ]    
  },
  resolve: {
    // options for resolving module requests
    // (does not apply to resolving to loaders)
    modules: [
      "node_modules",
      path.resolve(__dirname, "srcjs")
    ],
    // directories where to look for modules
    extensions: [".js", ".json", ".css"],
  },
  performance: {
    hints: "warning", // enum
    maxAssetSize: 200000, // int (in bytes),
    maxEntrypointSize: 400000, // int (in bytes)
    assetFilter: function(assetFilename) {
      // Function predicate that provides asset filenames
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
    }
  },
  devtool: false, // enum
  // enhance debugging by adding meta info for the browser devtools
  // source-map most detailed at the expense of build speed.
  context: __dirname, // string (absolute path!)
  // the home directory for webpack
  // the entry and module.rules.loader option
  //   is resolved relative to this directory
  target: "web", // enum
  // the environment in which the bundle should run
  // changes chunk loading behavior and available modules
  externals: {
    React: "react"
  },
  
  devServer: {
    contentBase: path.resolve(__dirname, './dist'), // boolean | string | array, static file location
    compress: true, // enable gzip compression
    historyApiFallback: true, // true for index.html upon 404, object for multiple paths
    hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
    https: false, // true for self-signed, object for cert authority
    noInfo: true, // only errors & warns on hot reload
    overlay: true,
    port: 8181,
    host: "192.168.25.36"
  },
  plugins: [
    new webpack.ProvidePlugin({
        React: 'react'
    }),
    new CopyWebpackPlugin([{
            from: './materials',
            to: './materials'
        }
    ])        
  ]
}

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'source-map';
  }

  if (argv.mode === 'production') {
    config.devtool = false
  }

  return config;
}