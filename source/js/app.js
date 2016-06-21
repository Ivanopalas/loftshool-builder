function setEqualHeight(columns)
{
    var tallestcolumn = 0;
    columns.each(
        function()
        {
            currentHeight = $(this).height();
            if(currentHeight > tallestcolumn)
            {
                tallestcolumn = currentHeight;
            }
        }
    );
    columns.children().height(tallestcolumn);
}
$(document).ready(function() {
    setEqualHeight($(".js-equalheight > div"));
});