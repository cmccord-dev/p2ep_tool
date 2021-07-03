# Tools for extracting files from Persona 2: Eternal Punishment for the PSX

these tools are provided as is, I make no guarantees they will work properly.
I made them with the task of bringing the original psx translation in line with the PSP version of Innocent Sin, ie doing away with the Revalations names for characters as well as updating some Persona and Spell names.  
The tools work directly on the original ISO, and will update the FILEPOS.DAT appropriately.  some of the archives have special requirements for being rebuilt properly, but I haven't tested it thoroughly outside of my target changes.  Also, I don't update error correcting codes for each sector at the moment, so images made with these tools will not run on hardware.  it shouldn't be difficult to fix them.  
Additionally, some of the archive have LUT tables in the code binaries.  I know the format of some of these tables but I haven't searched exhaustively for them.  It shouldn't be that difficult to find. 

Reinsertion is possible for most types of text data.  reinserting images should also be pretty straightforward, but you'd need to create a script similar to the insert_script and compress them appropriately.  I believe the original packing tools would automatically determine the best compression on a file by file basis, but I haven't tested it.  All the text data is best compressed with LZSS.

I will work to document my findings and clean up the scripts over time.  I will also work towards documenting the formats of the game files.  

You need to edit conf.json with the path to the bin you want to work with.  I plan to make it a command line option at some point  