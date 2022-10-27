import { Editor } from "https://esm.sh/@tiptap/core";
import StarterKit from "https://esm.sh/@tiptap/starter-kit";
import Document from 'https://esm.sh/@tiptap/extension-document'
import Paragraph from 'https://esm.sh/@tiptap/extension-paragraph'
import Text from 'https://esm.sh/@tiptap/extension-text'
import Heading from 'https://esm.sh/@tiptap/extension-heading';

new Editor({
  element: document.querySelector('.element'),
  extensions: [
    StarterKit,
    Document,
    Paragraph,
    Text,
  ],
  content: '<p>Hello World!</p>',
})




