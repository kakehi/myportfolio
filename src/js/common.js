var isFirstTime = false;
var isMobile = false;

// --- Check Device
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent))
	isMobile = true;