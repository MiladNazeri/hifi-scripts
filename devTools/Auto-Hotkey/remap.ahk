; Script to help remap your keyboard in a secondary mode

; CapsLock navigation
; Suspend means it's not running
Suspend On
isOn := false
msgOn := "O N"
msgOff := "O F F"
currentMessage := msgOff
; Toggle suspense with Ctrl + 6
;^6::Suspend, toggle
^;::
Suspend, toggle
isOn := !isOn
if (isOn) {
    currentMessage := msgOn
} else {
    currentMessage := msgOff
}

CustomColor := "EEAA99"  ; Can be any RGB color (it will be made transparent below).
Gui +LastFound +AlwaysOnTop -Caption +ToolWindow  ; +ToolWindow avoids a taskbar button and an alt-tab menu item.
Gui, Color, %CustomColor%
Gui, Font, s32 cFFFFFF ; Set a large font size (32-point).
Gui, Add, Text,, %currentMessage%  ; XX & YY serve to auto-size the window.
; Make all pixels of this color transparent and make the text itself translucent (150):
WinSet, TransColor, %CustomColor% 175
Gui, Show, Center NoActivate  ; NoActivate avoids deactivating the currently active window.
Sleep, 135
Gui, Destroy
return

; MouseGetPos, xPos, yPos	
; GUI, ADD, Text, , %currentMessage%
; Gui, SHOW, x%xPos% y%yPos%
; Gui, ToolWindow
; Sleep, 500
; Gui, Destroy


return
; https://autohotkey.com/docs/KeyList.htm
; ` escape a character
; # Windows key
; + Shift
; ^ Ctrl
; ! Alt

; Arrow keys
i::Up
j::Left
k::Down
l::Right
,::^Left  ; This does control Left and right to skip between words = default windows function
.::^Right 

; Standard Navigation
u::Home
o::End
p::PgUp
`;::PgDn

; Additonal function keys
n::Tab
h::Backspace
y::Delete
1::Esc
4::^w ; close window

; cut copy and paste
c::^c 
v::^v
x::^x

; VS Code things
q::^+o ; opens up the symbols finder
w::^+[ ; fold
e::^+] ; unfold
g::^g ; Go to line
r::+!Down ; Copies the line down
z::^z ; undo
f::^f ; finds
7::+Up ; shift up to highlight above current line
8::+Down ; high light below
9::^+\ ; go to the end of the current bracket
a::+F12 ; find all references to the current high light
s::^s ; saves a file
d::^/ ; turns line into a comment
b::+!g ; Smart Grow
5::^d ; add the next occurance of highlighted item
2::^#!2 ; Git commit all
3::^b ; Files

t::Click
^t::Click, right
'::WheelUp
/::WheelDown
6::MouseMove, % A_CaretX, % A_CaretY
; ^i::MouseMove, 0, -20, 0, R  ; Win+UpArrow hotkey => Move cursor upward
; ^k::MouseMove, 0, 20, 0, R  ; Win+DownArrow => Move cursor downward
; ^j::MouseMove, -20, 0, 0, R  ; Win+LeftArrow => Move cursor to the left
; ^l::MouseMove, 20, 0, 0, R  ; Win+RightArrow => Move cursor to the right
; +i::MouseMove, 0, -5, 0, R  ; Win+UpArrow hotkey => Move cursor upward
; +k::MouseMove, 0, 5, 0, R  ; Win+DownArrow => Move cursor downward
; +j::MouseMove, -5, 0, 0, R  ; Win+LeftArrow => Move cursor to the left
; +l::MouseMove, 5, 0, 0, R  ; Win+RightArrow => Move cursor to the right
; !i::MouseMove, 0, -175, 0, R  ; Win+UpArrow hotkey => Move cursor upward
; !k::MouseMove, 0, 175, 0, R  ; Win+DownArrow => Move cursor downward
; !j::MouseMove, -175, 0, 0, R  ; Win+LeftArrow => Move cursor to the left
; !l::MouseMove, 175, 0, 0, R  ; Win+RightArrow => Move cursor to the right
; 6::MouseMove, % A_CaretX, % A_CaretY
UP::MouseMove, 0, -40, 0, R  ; Win+UpArrow hotkey => Move cursor upward
DOWN::MouseMove, 0, 40, 0, R  ; Win+DownArrow => Move cursor downward
LEFT::MouseMove, -40, 0, 0, R  ; Win+LeftArrow => Move cursor to the left
RIGHT::MouseMove, 40, 0, 0, R  ; Win+RightArrow => Move cursor to the right
^!UP::MouseMove, 0, -10, 0, R  ; Win+UpArrow hotkey => Move cursor upward
^!DOWN::MouseMove, 0, 10, 0, R  ; Win+DownArrow => Move cursor downward
^!LEFT::MouseMove, -10, 0, 0, R  ; Win+LeftArrow => Move cursor to the left
^!RIGHT::MouseMove, 10, 0, 0, R  ; Win+RightArrow => Move cursor to the right
^UP::MouseMove, 0, -250, 0, R  ; Win+UpArrow hotkey => Move cursor upward
^DOWN::MouseMove, 0, 250, 0, R  ; Win+DownArrow => Move cursor downward
^LEFT::MouseMove, -250, 0, 0, R  ; Win+LeftArrow => Move cursor to the left
^RIGHT::MouseMove, 250, 0, 0, R  ; Win+RightArrow => Move cursor to the right
