console.log('a');
	(function(jquery){
		//Parses the LRC Data
		function lrcParser(data){
			var _arrayOfLrc=data.split("\n");
			var _LRC={
				meta:{},
				text:[],
				lyrics:[]
			};
			_arrayOfLrc.forEach(function(item,index,ar){
				var metaData=/\[(\D+):(\D+)\]/;
				var textData=/^(\w+)/;
				var timeData=/^(\[\d+:\d+\.\d+\]|\[\d+:\d+\])(.+)/;      
				if(metaData.test(item)){
					var d=metaData.exec(item);
					_LRC.meta[d[1]]=d[2];	
	
				}
				else if(textData.test(item)){
					_LRC.text.push(textData.exec(item)[1]);
				}
				else if(timeData.test(item)){
					var data=timeData.exec(item);
					_LRC.lyrics.push({'time':data[1],'lyrics':data[2]});
					data=null;
				}   
			});
			return _LRC;
		}	
		var lrc = document.querySelector('.lrc');
		var datalrc = lrc.getAttribute('data-lrc');
		var showlrc = document.querySelector('.showlrc');
	
		
		jquery.ajax(datalrc).then(function(data){
			
			let a = lrcParser(data);
			let b = a.lyrics;
			let showlyrics = "";
			
			for (let i = 0; i < b.length; i++) {
				showlyrics += b[i].time+b[i].lyrics+'\n';
			}
			showlrc.innerHTML = showlyrics;
	
		});
	})(jQuery);


