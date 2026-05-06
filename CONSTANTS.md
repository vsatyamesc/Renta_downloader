	var page = 0;
	var now = 0;
	var img_size_x = 842, img_size_y = 1200;
	var win_w,win_h;
	var rate = 0;
	var resize_pt = 0;
	var openLR = 0;
	var flg_animate = false;
	var all_page = {};
	
	let pageCt=1;
	
	var prd_ser = "3072446";
	var url_base = "/sc/view_jsimg5/5e9aa4c5ccecf55e38/9-3072446-84/FIX001/";
	var url_base2 = "https://dre-aka-p.papy.co.jp/filesv/sc/contents/3072446/6s/0/";
	var url_base3 = "";
	
	var print_flag = 0;
	var buy_flg = "1";
	
	var isDragging = false;
	var isPinching = false;
	var initialDistance = 0;
	var initialScale = 1;
	
	var pinchCenterX, pinchCenterY;
	
	var startX;
	var startTranslateX = 0;
	var currentTranslateX = 0;
	var dragStartTime = 0;
	var dragEndTime = 0;
	var inertiaSpeed = 0;
	var img_rate = 0;
	var win_rate;
	var intervalId;
	
	var canv_w = 0;
	var canv_h = 0;
	
	var OpenLR = 0;				//右開きフラグ(1:右開き)
	
	var page = parseInt("1");				//現在のページ
	var now = parseInt("1");
	
	if( now === 1){
		now = 0;
	}
	var page_back = -1;
	var set_page = parseInt("1");			//栞更新用
	var max_page = parseInt("200");		//総ページ数
	var user_id = "8730697";			//ユーザID
	var m_line="1:#:表紙|4:#:目次|5:#:第１５話|17:#:第１６話|31:#:第１７話|47:#:第１８話|63:#:第１９話|81:#:第２０話|97:#:第２１話|115:#:第２２話|133:#:第２３話|149:#:第２４話|165:#:第２５話|187:#:おまけ";			//目次情報
	var en_flag = 0;		//海外版と日本語版の判別(1:英語版 0:日本語版)
	var gflg = 0;			//DL許可、写真集フラグ (0:DL可、漫画 1:DL不可 2:写真集)
	var applink = "<APPLINK>";			// アプリケーションとの連携
	var no_type8 = 0;		// type8存在フラグ
	var cnts_type = 2;	// コンテンツtype
	var url_bookmark = "https://dre-viewer2.papy.co.jp/sc/bookmark/5e9aa4c5ccecf55e38/9-3072446-84/FIX001/";
	var ar_edge = url_base2.split("/");
	var edge = ar_edge[2];
	var viewer_mode = "akamai";
	var auth_key = "auth-key=exp=xyz...";
	var auth_key3 = "";
	var rt_id = "FIX001";
	var cache_update = "202605011028";
	var url_jump = "https://renta.papy.co.jp/renta/sc/jump.cgi?prd=9-3072446-84";	// 飛び先
	var update_lock = 0;
	
	var transelateX = 0;
	var transelateY = 0;
	
	var server_name = location.hostname;
	var domain = ".ebookbank.jp";
	if( server_name.search(/papy.co.jp/) != -1 ){
		domain = ".papy.co.jp";
	}
	
	if( location.protocol == 'https:' ){
		server_name = "s_"+server_name;
	}
	
	var offset_left,offset_top;
	var dev;
	
	scale = window.devicePixelRatio;
	//scale = 1;
	
	var imageSplit = 7;
	
	var last_win_w = window.innerWidth;
	var last_win_h = window.innerHeight;
	var thresholdChange = 100;
	
	var path = location.pathname;
	var ar_path = path.split("/");
	var prd_tid = ar_path[4].split("-");
	prd_id = Number(prd_tid[1]);
	
	var flg_smpl = false;
	if( user_id == "sample" ) {	flg_smpl = true; }
	var cfgbackGround = "#111";
	var cfgAnimation = true;
	var cfgEndBookmark = false;
	var cfgOnePage = false;
	var cfgAutoJump = false;
	var view_data = { prd_id:prd_id, in_page: page, last_page: page, back_page: page_back, last_time: 0, s_flg: flg_smpl };
	var view_cfg = { cfg_backGround: cfgbackGround, cfg_animation: cfgAnimation, cfg_endBookmark: cfgEndBookmark, cfg_autoJump: cfgAutoJump };
	
	var tBookMark = 10000;
	
	var arPage = {};
	var viewWrap_w = 0;
	var viewWrap_left = 0;
	var zoom = 1;
	var m_zoom = 2;
	
	var sukasi_canvas = new Array(6);
	var sukasi_ctx = new Array(6);
	
	var fit_w = true;
	fit_w = false;
	
	var gDiffW,gDiffH;
	
	// var ua = window.navigator.userAgent.toLowerCase();	//useragent(小文字で)
	
	var animation = 'all 0.3s ease-out';
	var no_animation = '';
	
	var scrollY = 0;
	
	var navi_url="https://renta.papy.co.jp/renta/sc/item_navi.cgi?prd_tid=9-3072446";
	var item_url="https://renta.papy.co.jp/renta/sc/frm/item/428503/";
	var read_url="https://renta.papy.co.jp/renta/sc/jump/read?prd_tid=9-3072446";
	var next_flg="0";
	var prev_flg="1";

	var next_buy_flg = "0";
	var prev_buy_flg = "0";