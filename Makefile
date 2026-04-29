all: report.pdf

report.pdf:report.tex
	pdflatex report.tex
	pdflatex report.tex
.PHONY: clean
clean:
	rm -f *.aux *.log *.pdf *.out *.toc *.fdb_latexmk *.gz *.fls
