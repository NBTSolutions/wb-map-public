var nbt = nbt || { };
nbt.generic = nbt.generic || { };
nbt.generic.Util = {
    isSafariLionOrNewer: function(ua) {
        if (ua.indexOf("AppleWebKit") == -1) return false;

        var major = parseInt(/X (\d{2})/.exec(ua)[1]);
        var minor = parseInt(/\d{2}_(\d{1,2})/.exec(ua)[1]);

        return major >= 10 && minor >= 7;
    },
    /**
     * Determine whether the file loaded from PhoneGap or not
     */
    isPhoneGap: function() {
        return (window.cordova || window.PhoneGap || window.phonegap) 
            && /^file:\/{3}[^\/]/i.test(window.location.href) 
            && /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent);
    }

    /*
    isSafariLionOrNewer_test: function() {
        var mlSafari = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8) AppleWebKit/536.25 (KHTML, like Gecko) Version/6.0 Safari/536.25";
        var mlFirefox = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:12.0) Gecko/20100101 Firefox/12.0";
        var lSafari = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/534.55.3 (KHTML, like Gecko) Version/5.1.3 Safari/534.53.10";
        
        //print(this.isSafariLionOrNewer(mlSafari));
        //print(this.isSafariLionOrNewer(mlFirefox));
        //print(this.isSafariLionOrNewer(lSafari));
    }
    */
};
//nbt.generic.Util.isSafariLionOrNewer_test();
