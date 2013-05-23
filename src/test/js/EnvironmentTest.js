describe('environment',function(){
    it('test core environment', function() {
        expect(window).toBeDefined();
        expect(enyo).toBeDefined();
        expect(wb.Map).toBeDefined();
    });
    it('test ancillary dependencies', function() {
        expect(moment).toBeDefined();
        expect(_).toBeDefined();
    });
});
