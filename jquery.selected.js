(function ($) {

/**
 * The selected() plug-in.
 * This jQuery plugin adds and removes the css class "selected" from an html element or group of elements
 * 
 * $.selected.events.SELECTED   - dispatched each time the html element is marked selected
 * $.selected.events.UNSELECTED - dispatched each time the html element is marked unselected
 * $.selected.events.CHANGE     - dispatched only when the html element's selected value is changed
 * 
 * @author Jason Savage
 * 2014 jasonsavage.com
 * 
 * Usage ::
 * 
 * Setter - adds and removes the css class "selected" from all the html elements in the selector
 * $("ul li").selected(true);
 * 
 * Getter - returns the element(s) that have the class 'selected' or an empty array
 * var selectedElement = $("ul li").selected();
 * 
 * helpers
 * ------------------------------------------------------------------------------------------
 * $("ul li:first-child").isSelected();
 * - adds and removes the css class "selected" from all the html elements in the selector
 * @return boolean
 * 
 * $("ul li:first-child").selectedToggle();
 * - toggles the element to selected or unselected
 * 
 * settings
 * ------------------------------------------------------------------------------------------
 * $.selected.className = 'selected'; - this can be changed if you would rather use a different class name.
 * 
 */

$.selected = {
    className : "selected",
    events : {
        SELECTED    : 'selected.selected',
        UNSELECTED  : 'unselected.selected',
        CHANGE      : 'change.selected'
    }
};

/**
 * Selected plugin
 */
$.fn.selected = function (value)
{
    value = (typeof value === 'boolean') ? value : null;
    
    //setter - sets all elements in array to selected or unselected and returns them all
    if (value !== null)
    {
        return $(this).each(function()
        {
            var changed     = false,
                $this       = $(this),
                hasClass    = $this.hasClass( $.selected.className );
            
            if( value )
            {
                //select
                if( ! hasClass )
                {
                    $this.addClass( $.selected.className );
                    $this.trigger( $.selected.events.SELECTED );
                    changed = true;
                }
            }
            else
            {
                //unselect
                if( hasClass )
                {
                    $this.removeClass( $.selected.className );
                    $this.trigger( $.selected.events.UNSELECTED );
                    changed = true;
                }
            }
            
            if(changed)
                //trigger change event
                $this.trigger( $.selected.events.CHANGE );
        });
    }
    
    //getter - returns an array of selected elements
    return $(this).filter( '.' + $.selected.className );
};

//helpers
$.fn.isSelected = function ()
{
    return $(this).hasClass( $.selected.className );
};
$.fn.selectedToggle = function ()
{
    var $this = $(this);
    return $this.selected( ! $this.isSelected() );
};

 /**
 * The selectedGroup() plug-in.
 * This jQuery Plugin is ment to be used with the selected() plugin to create a group of selected items which only one item can be selected at a time.
 * (radio button functionality)
 * 
 * @author Jason Savage
 * 2013 jasonsavage.com
 * 
 * Usage ::
 * 
 *  $("ul li").selectedGroup(function(selectedIndex, selectedItem) {
 *     $(selectedItem).css("background-color","red");
 *  });
 * 
 */


/**
 * Selected Group plugin
 */
$.fn.selectedGroup = function (onChange)
{
    var $items = $(this),
        selectedIndex = -1,
        onSelectionChange = onChange || function(index, element) { };
    
    return $items.each(function (index, element)
    {
        //add a selected listener to each html element in the group
        $(element).on( $.selected.events.SELECTED, function(e)
        {
            //check if this html element isn't already the selected
            if(selectedIndex !== index ) 
            {
                selectedIndex = index;
                
                //get all the elements that are selected, that are not this element, and deselect them.
                $items.selected()
                      .not(element)
                      .selected(false);
                
                //call change callback
                onSelectionChange( selectedIndex, element );
             }
        });
    });
};

//helpers
$.fn.selectedGroupIndex = function ()
{
    return $(this).index( $(this).selected().first() );
};




}(jQuery));